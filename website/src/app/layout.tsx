import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { AuthProvider } from '@/contexts/AuthContext';
import { studio } from '@/lib/studio';

const heading = localFont({ src: [
  { path: '../../public/fonts/barlow-condensed-600.ttf', weight: '600', style: 'normal' },
  { path: '../../public/fonts/barlow-condensed-700.ttf', weight: '700', style: 'normal' },
], variable: '--font-heading', display: 'swap' });
const body = localFont({ src: [
  { path: '../../public/fonts/manrope-400.ttf', weight: '400', style: 'normal' },
  { path: '../../public/fonts/manrope-600.ttf', weight: '600', style: 'normal' },
  { path: '../../public/fonts/manrope-700.ttf', weight: '700', style: 'normal' },
], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'G3 CrossFit Berlin | Stärker. Zusammen.', template: '%s | G3 CrossFit Berlin' },
  description: 'CrossFit am Berliner Gleisdreieck: persönliches Coaching, kleine Gruppen und Training für jedes Level. Jetzt ein kostenloses Probetraining anfragen.',
  metadataBase: new URL(studio.url),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'G3 CrossFit Berlin | Stärker. Zusammen.',
    description: 'Dein Training. Deine Leute. Lerne G3 bei einem kostenlosen persönlichen Probetraining kennen.',
    type: 'website', locale: 'de_DE', siteName: studio.name, url: studio.url,
    images: [{ url: '/images/g3/team.jpg', width: 1536, height: 1036, alt: 'Das G3 CrossFit Trainerteam in Berlin' }],
  },
  twitter: { card: 'summary_large_image', images: ['/images/g3/team.jpg'] },
  category: 'Fitness',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body className={`${heading.variable} ${body.variable} antialiased`}>
    <StructuredData />
    <AuthProvider><Header /><Breadcrumbs /><main id="main-content">{children}</main><Footer /></AuthProvider>
  </body></html>;
}
