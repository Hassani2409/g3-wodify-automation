import type { Metadata } from 'next';
import TrialDemo from './trial-demo';

export const metadata: Metadata = {
  title: 'Probetraining-Automation · interaktive Demo',
  description: 'Testbare Arbeitsprobe mit simulierten Anfragen, Dublettenprüfung und Fehlerbehandlung.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/demo/probetraining' },
};

export default function Page() { return <TrialDemo />; }
