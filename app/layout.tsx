import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'macbuilds',
  description: 'Mac Calvo-Johnson — Boston-based builder.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#080808' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #080808; min-height: 100%; }
          body { -webkit-text-size-adjust: 100%; }
        `}</style>
      </head>
      <body style={{ background: '#080808', margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
