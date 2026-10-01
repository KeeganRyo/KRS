import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'KRS App',
  description: 'Aplikasi QR & Review Bisnis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        
        {/* Script Google Maps Places API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
