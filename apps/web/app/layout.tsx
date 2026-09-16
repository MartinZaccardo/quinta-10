import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Quinta del 10',
  description: 'Sistema de reservas de canchas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
