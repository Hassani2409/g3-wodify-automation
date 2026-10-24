import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { studio } from '@/lib/studio';
import styles from './SiteChrome.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}><div><p className={styles.footerTitle}>Dein Training.<br />Deine Leute.</p><Link href={studio.trialHref} className={styles.footerAction}>G3 kennenlernen <ArrowUpRight aria-hidden="true" size={20} /></Link></div><div><h2>Besuch uns</h2><p>{studio.street}<br />{studio.postcode} {studio.city}<br />{studio.entrance}</p><a href={studio.maps} target="_blank" rel="noopener noreferrer">Anfahrt ansehen</a></div><div><h2>Sprich mit uns</h2><a href={studio.phoneHref}>{studio.phone}</a><a href={`mailto:${studio.email}`}>{studio.email}</a><Link href="/contact">Kontakt & Probetraining</Link></div></div>
      <div className={styles.footerWord} aria-hidden="true">G3 CROSSFIT</div>
      <div className={styles.footerBottom}><span>© {new Date().getFullYear()} G3 CrossFit Berlin</span><nav aria-label="Rechtliche Informationen"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/agb">AGB</Link></nav></div>
    </footer>
  );
}
