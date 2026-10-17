import CardShell from '@/components/CardShell';
import ForgotCodeForm from '@/components/ForgotCodeForm';

export const metadata = { title: 'Lupa kode kartu' };

export default function ForgotCodePage() {
  return (
    <CardShell title="Lupa kode kartu?">
      <p>Masukkan nomor HP yang kamu isi waktu aktivasi kartu, lalu kirim lewat WhatsApp. Kami balas dengan kode kartu kamu.</p>
      <ForgotCodeForm />
    </CardShell>
  );
}
