import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['700'], variable: '--f-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-body', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL || 'https://krsolutions.tech'),
  title: { default: 'KR Solutions', template: '%s · KR Solutions' },
  // Halaman kartu dan admin tidak perlu diindeks; landing page mengatur ulang ini.
  robots: { index: false, follow: false },
};

export const viewport = { themeColor: '#1A1190' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
