import CardShell from '@/components/CardShell';
import ForgotCodeForm from '@/components/ForgotCodeForm';

export const metadata = { title: 'Lupa kode kartu' };

export default function ForgotCodePage() {
  return (
    <CardShell title="Lupa kode kartu?">
      <p>Masukkan nomor HP yang kamu isi waktu aktivasi kartu. Untuk mengedit kartu, kamu tetap perlu PIN.</p>
      <ForgotCodeForm />
    </CardShell>
  );
}
