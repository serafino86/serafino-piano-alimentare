import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Piano Alimentare · Emanuele',
  description: 'Piano alimentare personalizzato — Serafino',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
