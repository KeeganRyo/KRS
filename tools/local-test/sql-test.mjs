import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'fs';

const repo = process.argv[2];
const db = new PGlite();
const q = (s, p) => db.query(s, p).then((r) => r.rows);
let fails = 0;
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`);
  if (!ok) fails++;
};

await db.exec(`create role anon; create role authenticated; create role service_role;`);
await db.exec(readFileSync(`${repo}/supabase/schema.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/seed.sql`, 'utf8'));
// An old-style active card (pre-migration) to check the backfill
await db.exec(`update cards set status='active', google_url='https://search.google.com/local/writereview?placeid=ChIJ1234567890abcdefghij', pin_hash='x' where code='TXN38X'`);

const mig = readFileSync(`${repo}/supabase/migrations/002_upgrade.sql`, 'utf8');
await db.exec(mig);
await db.exec(mig); // idempotent
check('migration runs twice', true);

const [old] = await q(`select target_type, target_value, target_url from cards where code='TXN38X'`);
check('backfill old card', old.target_type === 'review' && old.target_value === 'ChIJ1234567890abcdefghij' && old.target_url.includes('placeid='), JSON.stringify(old));

// card_hit
const [h0] = await q(`select card_hit('EXNDXC') as url`);
check('card_hit unactivated -> null', h0.url === null);
const [h1] = await q(`select card_hit('TXN38X') as url`);
await q(`select card_hit('TXN38X')`);
const [s] = await q(`select scans, last_scan_at from cards where code='TXN38X'`);
const [cnt] = await q(`select count(*)::int n from card_scans where code='TXN38X'`);
check('card_hit active -> url + scans', h1.url?.includes('placeid=') && s.scans === 2 && cnt.n === 2 && s.last_scan_at, `scans=${s.scans} rows=${cnt.n}`);

// claim_pin_attempt
const claims = [];
for (let i = 0; i < 6; i++) claims.push((await q(`select * from claim_pin_attempt('TXN38X', 5, 15)`)).length);
check('5 claims allowed, 6th blocked', claims.join('') === '111110', claims.join(''));
const [lk] = await q(`select failed_attempts, lockouts, extract(epoch from (locked_until - now()))/60 as mins from cards where code='TXN38X'`);
check('locked ~15 min after 5', lk.lockouts === 1 && lk.mins > 14 && lk.mins <= 15, JSON.stringify(lk));
await db.exec(`update cards set locked_until = now() - interval '1 second' where code='TXN38X'`);
const [after] = await q(`select * from claim_pin_attempt('TXN38X', 5, 15)`);
check('after expiry attempts reset to 1', after?.attempts === 1, JSON.stringify(after));
for (let i = 0; i < 4; i++) await q(`select * from claim_pin_attempt('TXN38X', 5, 15)`);
const [lk2] = await q(`select lockouts, extract(epoch from (locked_until - now()))/60 as mins from cards where code='TXN38X'`);
check('second lockout doubles to ~30 min', lk2.lockouts === 2 && lk2.mins > 29 && lk2.mins <= 30, JSON.stringify(lk2));
const none = await q(`select * from claim_pin_attempt('EXNDXC', 5, 15)`);
check('claim on unactivated card -> no row', none.length === 0);

// throttle
const th = [];
for (let i = 0; i < 4; i++) th.push((await q(`select throttle_hit('ip:1', 3, 60) as ok`))[0].ok);
check('throttle 3 then blocked', th.join(',') === 'true,true,true,false', th.join(','));
await db.exec(`update throttle set window_start = now() - interval '2 minutes' where key='ip:1'`);
const [th2] = await q(`select throttle_hit('ip:1', 3, 60) as ok`);
check('throttle window resets', th2.ok === true);

// stats
const [st] = await q(`select * from card_stats('TXN38X')`);
check('card_stats', st.total === 2 && st.last_7 === 2 && st.last_30 === 2, JSON.stringify(st));
const daily = await q(`select * from card_daily('TXN38X', 14)`);
check('card_daily 14 rows, today=2', daily.length === 14 && daily[13].n === 2, `len=${daily.length} today=${daily[13]?.n}`);
const list = await q(`select * from admin_cards('')`);
const found = await q(`select code from admin_cards('txn')`);
check('admin_cards list + search', list.length === 5 && found.length === 1 && found[0].code === 'TXN38X', `all=${list.length} search=${found.map((r) => r.code)}`);

// Transition: OLD code (only knows google_url) running against the migrated DB
const P1 = 'https://search.google.com/local/writereview?placeid=ChIJoldActivationAAAAAAAAA';
const P2 = 'https://search.google.com/local/writereview?placeid=ChIJoldEditBBBBBBBBBBBBBB';
await db.query(`update cards set google_url=$1, business_name='Old', pin_hash='x', status='active', activated_at=now() where code='EXNDXC' and status='unactivated'`, [P1]);
const [a1] = await q(`select card_hit('EXNDXC') as url`);
check('old-code activation -> tap works', a1.url === P1, a1.url);
await db.query(`update cards set google_url=$1 where code='EXNDXC'`, [P2]);
const [a2] = await q(`select card_hit('EXNDXC') as url`);
const [t2] = await q(`select target_type, target_value from cards where code='EXNDXC'`);
check('old-code edit -> new target used', a2.url === P2 && t2.target_value === 'ChIJoldEditBBBBBBBBBBBBBB', `${a2.url} ${t2.target_value}`);
// NEW code switches to Instagram (google_url -> null, target changes): trigger must not interfere
await db.exec(`update cards set target_type='instagram', target_value='kopi', target_url='https://www.instagram.com/kopi/', google_url=null where code='EXNDXC'`);
const [a3] = await q(`select card_hit('EXNDXC') as url`);
check('new-code instagram not overridden', a3.url === 'https://www.instagram.com/kopi/', a3.url);
// NEW code saves a review target (both columns change together)
await db.query(`update cards set target_type='review', target_value='ChIJnewReviewCCCCCCCCCCCC', target_url=$1, google_url=$1 where code='EXNDXC'`, ['https://search.google.com/local/writereview?placeid=ChIJnewReviewCCCCCCCCCCCC']);
const [a4] = await q(`select card_hit('EXNDXC') as url`);
check('new-code review save', a4.url.endsWith('ChIJnewReviewCCCCCCCCCCCC'), a4.url);
// Admin reset (everything null) stays empty
await db.exec(`update cards set status='unactivated', google_url=null, target_type=null, target_value=null, target_url=null where code='EXNDXC'`);
const [a5] = await q(`select card_hit('EXNDXC') as url, (select target_type from cards where code='EXNDXC') t`);
check('admin reset leaves card empty', a5.url === null && a5.t === null);

console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
