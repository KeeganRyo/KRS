import CardShell from './CardShell';

export default function TooManyMisses() {
  return (
    <CardShell title="Terlalu banyak percobaan">
      <p>Terlalu banyak kode kartu yang salah dari perangkat ini. Coba lagi 10 menit lagi, atau periksa kode di belakang papan.</p>
      <a className="btn" href="/">Ke halaman utama</a>
    </CardShell>
  );
}
