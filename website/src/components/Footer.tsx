import Link from 'next/link';
import Image from 'next/image';
import { studio } from '@/lib/studio';
import s from './ClubChrome.module.css';
export default function Footer(){return <footer className={s.footer}><div className={s.footerGrid}>
  <div><Link href="/" className={s.footerBrand}><Image src="/logo.png" alt="G3 CrossFit" width={65} height={90}/></Link><p>Persönliches Training.<br/>Mitten in Berlin.</p></div>
  <div><h2>Besuch uns</h2><address>{studio.street}<br/>{studio.postcode} {studio.city}<br/>{studio.entrance}</address><a href={studio.maps} target="_blank" rel="noopener noreferrer">Anfahrt ansehen</a></div>
  <div><h2>Sprich mit uns</h2><a href={studio.phoneHref}>{studio.phone}</a><a href={`mailto:${studio.email}`}>{studio.email}</a><Link href="/contact#booking">Probetraining anfragen</Link></div>
  <div><h2>G3 entdecken</h2><Link href="/training">Training</Link><Link href="/coaches">Coaches</Link><Link href="/pricing">Mitgliedschaften</Link><Link href="/shop">Shop</Link><Link href="/login">Mitgliederbereich</Link></div>
</div><div className={s.footerBottom}><span>© {new Date().getFullYear()} G3 CrossFit Berlin</span><nav aria-label="Rechtliches"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/agb">AGB</Link></nav></div></footer>}
