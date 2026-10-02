import type { Metadata } from 'next';
import { Inter, Barlow_Condensed } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'La Quinta del 10',
  description: 'Sistema de reservas de canchas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
