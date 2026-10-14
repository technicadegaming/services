import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://services.technicade.tech'),
  title: 'Services & Custom Requests | Technicade',
  description: 'Get help with technology troubleshooting, arcade equipment, 3D printed replacement parts, electronics or custom software. Describe your project before committing.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Technicade Services | Custom Tech & Arcade Help',
    description: 'Request a review for technology, repairs, 3D printing, electronics, arcade equipment or a custom software project.',
    type: 'website',
    url: 'https://services.technicade.tech/',
    siteName: 'Technicade',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Technicade Technology and Custom Project Services',
  description: 'Technology troubleshooting, arcade equipment support, electronics diagnostics, 3D printing and custom software project requests.',
  provider: {
    '@type': 'Organization',
    name: 'Technicade',
    url: 'https://technicade.tech/',
  },
  areaServed: { '@type': 'AdministrativeArea', name: 'Central Wisconsin' },
  url: 'https://services.technicade.tech/',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><body style={{
    fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
    margin: 0,
    background: 'radial-gradient(circle at 12% 2%,#27264f 0,#0b1220 48%)',
    color: '#f3f4f6',
    minHeight: '100vh'
  }}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />{children}</body></html>;
}
