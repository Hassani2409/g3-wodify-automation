import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Kontakt & Probetraining', alternates: { canonical: '/contact' } };
export default function ContactLayout({children}: {children: React.ReactNode}) { return children; }
