'use client';
import { useEffect, useRef, useState } from 'react';

// Tab kategori menu digital. Kategori yang dipencet langsung aktif (berwarna), dan saat pelanggan
// scroll, tab ikut pindah ke kategori yang sedang terlihat. `cats`: [{ id, name }].
export default function MenuTabs({ cats }) {
  const [active, setActive] = useState(String(cats[0].id));
  const nav = useRef(null);
  const lockUntil = useRef(0); // setelah tab dipencet, abaikan scroll sebentar supaya tab tidak lompat

  useEffect(() => {
    const secs = cats.map((c) => document.getElementById(`k-${c.id}`)).filter(Boolean);
    const onScroll = () => {
      if (Date.now() < lockUntil.current || !secs.length) return;
      let cur = secs[0].id;
      for (const s of secs) if (s.getBoundingClientRect().top <= 80) cur = s.id;
      // Kategori terakhir yang pendek tidak pernah sampai atas layar; aktifkan saat halaman mentok bawah.
      const root = document.documentElement;
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) cur = secs[secs.length - 1].id;
      setActive(cur.slice(2));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cats]);

  // Tab aktif digeser supaya kelihatan kalau kategorinya banyak (baris tab bisa digeser ke samping).
  useEffect(() => {
    const el = nav.current?.querySelector('[aria-current]');
    if (el) nav.current.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="mn-tabs" aria-label="Kategori menu" ref={nav}>
      {cats.map((c) => (
        <a
          key={c.id}
          href={`#k-${c.id}`}
          aria-current={String(c.id) === active ? 'true' : undefined}
          onClick={() => {
            lockUntil.current = Date.now() + 800;
            setActive(String(c.id));
          }}
        >
          {c.name}
        </a>
      ))}
    </nav>
  );
}
