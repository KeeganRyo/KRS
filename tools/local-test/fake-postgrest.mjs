// Minimal PostgREST emulator over PGlite — just the subset supabase-js uses in the KRS app.
// usage: node fake-postgrest.mjs <repoDir> <port>
import http from 'http';
import { readFileSync } from 'fs';
import { PGlite } from '@electric-sql/pglite';

const [repo, port = '54321'] = process.argv.slice(2);
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role;`);
await db.exec(readFileSync(`${repo}/supabase/schema.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/seed.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/002_upgrade.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/003_namecard.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/005_owner_phone.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/006_menu.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/007_wifi.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/008_prospects.sql`, 'utf8'));
await db.exec(readFileSync(`${repo}/supabase/migrations/009_invoices.sql`, 'utf8'));
// Test fixtures
await db.exec(`insert into cards (code) values ('TEST01'),('TEST02'),('TEST03') on conflict do nothing`);
await db.exec(`insert into cards (code, kind) values ('NAME01','namecard'),('NAME02','namecard') on conflict do nothing`);
await db.exec(`insert into cards (code, kind) values ('WIFI01','wifi') on conflict do nothing`);

const ident = (s) => {
  if (!/^[a-z_][a-z0-9_]*$/i.test(s)) throw new Error('bad ident ' + s);
  return `"${s}"`;
};

// Kolom jsonb: objek/array dikirim sebagai teks JSON.
const json = (v) => (v && typeof v === 'object' ? JSON.stringify(v) : v);

function parse(url) {
  const u = new URL(url, 'http://x');
  const params = [];
  const where = [];
  let select = '*';
  for (const [k, v] of u.searchParams) {
    if (k === 'select') { select = v; continue; }
    if (k === 'order' || k === 'limit' || k === 'offset' || k === 'columns') continue;
    const m = v.match(/^(eq|neq|is)\.(.*)$/);
    if (!m) throw new Error('unsupported filter ' + k + '=' + v);
    if (m[1] === 'is') { where.push(`${ident(k)} is ${m[2] === 'null' ? 'null' : 'not null'}`); continue; }
    params.push(m[2]);
    where.push(`${ident(k)} ${m[1] === 'eq' ? '=' : '<>'} $${params.length}`);
  }
  const cols = select === '*' ? '*' : select.split(',').map((c) => ident(c.trim())).join(',');
  return { path: u.pathname, params, where: where.length ? ' where ' + where.join(' and ') : '', cols, select };
}

async function handle(req, body) {
  const p = parse(req.url);
  const accept = req.headers['accept'] || '';
  const prefer = req.headers['prefer'] || '';
  const rep = prefer.includes('return=representation');
  const m = p.path.match(/^\/rest\/v1\/(rpc\/)?([a-z_]+)$/);
  if (!m) return [404, { message: 'no route' }];
  const [, isRpc, name] = m;

  if (isRpc) {
    const args = body ? JSON.parse(body) : {};
    const keys = Object.keys(args);
    const named = keys.map((k, i) => `${ident(k)} => $${i + 1}`).join(', ');
    const [{ proretset }] = (await db.query(`select proretset from pg_proc where proname = $1`, [name])).rows;
    if (proretset) {
      const r = await db.query(`select * from ${ident(name)}(${named})`, keys.map((k) => args[k]));
      return [200, r.rows];
    }
    const r = await db.query(`select ${ident(name)}(${named}) as v`, keys.map((k) => args[k]));
    return [200, r.rows[0].v];
  }

  const table = ident(name);
  let rows;
  if (req.method === 'GET') {
    rows = (await db.query(`select ${p.cols} from ${table}${p.where}`, p.params)).rows;
  } else if (req.method === 'PATCH') {
    const patch = JSON.parse(body);
    const keys = Object.keys(patch);
    const sets = keys.map((k, i) => `${ident(k)} = $${p.params.length + i + 1}`).join(', ');
    rows = (await db.query(`update ${table} set ${sets}${p.where} returning ${p.cols}`, [...p.params, ...keys.map((k) => json(patch[k]))])).rows;
  } else if (req.method === 'POST') {
    const list = [].concat(JSON.parse(body));
    rows = [];
    for (const obj of list) {
      const keys = Object.keys(obj);
      const r = await db.query(
        `insert into ${table} (${keys.map(ident).join(',')}) values (${keys.map((_, i) => `$${i + 1}`).join(',')}) returning ${p.cols}`,
        keys.map((k) => json(obj[k])),
      );
      rows.push(...r.rows);
    }
  } else if (req.method === 'DELETE') {
    rows = (await db.query(`delete from ${table}${p.where} returning ${p.cols}`, p.params)).rows;
  } else {
    return [405, { message: 'method' }];
  }

  if (req.method !== 'GET' && !rep) return [204, null];
  if (accept.includes('vnd.pgrst.object')) {
    if (rows.length !== 1) return [406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }];
    return [200, rows[0]];
  }
  return [200, rows];
}

// Storage tiruan (di memori): upload, download, URL publik, dan hapus. Hanya bucket 'avatars'.
const files = new Map();
function storage(req, raw, res) {
  const u = new URL(req.url, 'http://x');
  let m;
  if ((m = u.pathname.match(/^\/storage\/v1\/object\/public\/avatars\/(.+)$/)) && req.method === 'GET') {
    const f = files.get(m[1]);
    if (!f) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': f.type });
    return res.end(f.buf);
  }
  if ((m = u.pathname.match(/^\/storage\/v1\/object\/avatars\/(.+)$/))) {
    if (req.method === 'POST') {
      if (files.has(m[1])) { res.writeHead(409, { 'content-type': 'application/json' }); return res.end('{"message":"exists"}'); }
      if (raw.length > 512000) { res.writeHead(413, { 'content-type': 'application/json' }); return res.end('{"message":"too big"}'); }
      files.set(m[1], { buf: raw, type: req.headers['content-type'] || 'application/octet-stream' });
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ Key: `avatars/${m[1]}`, Id: m[1] }));
    }
    if (req.method === 'GET') {
      const f = files.get(m[1]);
      if (!f) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{"message":"not found"}'); }
      res.writeHead(200, { 'content-type': f.type });
      return res.end(f.buf);
    }
  }
  if (u.pathname === '/storage/v1/object/avatars' && req.method === 'DELETE') {
    const { prefixes = [] } = JSON.parse(raw.toString() || '{}');
    const gone = prefixes.filter((k) => files.delete(k)).map((name) => ({ name }));
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(gone));
  }
  res.writeHead(404, { 'content-type': 'application/json' });
  res.end('{"message":"no storage route"}');
}

http
  .createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      const raw = Buffer.concat(chunks);
      if (req.url.startsWith('/storage/')) {
        storage(req, raw, res);
        if (process.env.LOG) console.log(req.method, req.url, res.statusCode, `files=${files.size}`);
        return;
      }
      const body = raw.toString();
      try {
        const [status, data] = await handle(req, body);
        res.writeHead(status, { 'content-type': 'application/json' });
        res.end(data === null && status === 204 ? undefined : JSON.stringify(data));
        if (process.env.LOG) console.log(req.method, req.url, status);
      } catch (e) {
        console.error('ERR', req.method, req.url, e.message);
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ message: e.message, code: e.code || 'FAKE' }));
      }
    });
  })
  .listen(Number(port), () => console.log(`fake postgrest on :${port}`));
