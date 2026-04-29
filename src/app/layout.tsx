import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Any Storm — Dominique Schleider Senior Show',
  description: 'RSVP for Dominique Schleider\'s Senior Fashion Show. May 31. Six PM. Terman Fountain, Stanford University.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
