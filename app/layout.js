import './globals.css';

export const metadata = {
  title: 'Review Card',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
