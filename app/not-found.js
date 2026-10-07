import CardShell from '@/components/CardShell';

export default function NotFound() {
  return (
    <CardShell title="Kartu tidak ditemukan">
      <p>Periksa kembali kode di kartunya, atau hubungi KR Solutions.</p>
      <a className="btn" href="/">Ke halaman utama</a>
    </CardShell>
  );
}
