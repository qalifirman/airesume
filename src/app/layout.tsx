import '@/app/styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Resume',
  description: 'AI-Powered Resume Screening & Job Matching',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
