import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Custom Requests | Technicade',
  description: 'Request a review of a tech problem, small repair, 3D printing job, arcade issue, or custom software project. No payment required to ask.'
};

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><body style={{
    fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
    margin: 0,
    background: 'radial-gradient(circle at 12% 2%,#27264f 0,#0b1220 48%)',
    color: '#f3f4f6',
    minHeight: '100vh'
  }}>{children}</body></html>;
}
