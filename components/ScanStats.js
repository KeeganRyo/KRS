const fmt = new Intl.NumberFormat('id-ID');
const dateFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' });
const lastFmt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

// Ringkasan scan + grafik batang 14 hari (tanpa library chart).
// Label bawah memakai tanggal, karena inisial hari (S, S, R...) membingungkan.
export default function ScanStats({ stats, daily }) {
  const max = Math.max(1, ...daily.map((d) => d.n));
  return (
    <section className="stats" aria-label="Statistik scan">
      <div className="stat-row">
        <div className="stat"><strong>{fmt.format(stats?.total || 0)}</strong><span>Total tap &amp; scan</span></div>
        <div className="stat"><strong>{fmt.format(stats?.last_7 || 0)}</strong><span>7 hari terakhir</span></div>
        <div className="stat"><strong>{fmt.format(stats?.last_30 || 0)}</strong><span>30 hari terakhir</span></div>
      </div>
      <figure className="bars">
        <div className="bars-plot" role="img" aria-label={`Scan per hari, 14 hari terakhir: ${daily.map((d) => d.n).join(', ')}`}>
          {daily.map((d, i) => {
            const day = String(d.day).slice(0, 10); // 'YYYY-MM-DD'
            const date = new Date(`${day}T00:00:00Z`);
            const today = i === daily.length - 1;
            return (
              <div key={day} className={`bar${today ? ' today' : ''}`} title={`${dateFmt.format(date)}: ${d.n} scan`}>
                <span style={{ height: `${Math.max(d.n ? 8 : 2, (d.n / max) * 100)}%` }} />
                <em>{date.getUTCDate()}</em>
              </div>
            );
          })}
        </div>
        <figcaption>
          14 hari terakhir, kolom terakhir hari ini{stats?.last_at ? `. Scan terakhir ${lastFmt.format(new Date(stats.last_at))}` : ''}
        </figcaption>
      </figure>
    </section>
  );
}
