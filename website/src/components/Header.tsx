'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { studio } from '@/lib/studio';
import styles from './SiteChrome.module.css';

const navigation = [
  { label: 'Die Box', href: '/#box' },
  { label: 'Training', href: '/#training' },
  { label: 'Team', href: '/#team' },
  { label: 'Preise', href: '/#preise' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const onOutside = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia('(min-width: 901px)');
    const onResize = () => { if (media.matches) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onOutside);
    media.addEventListener('change', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onOutside); media.removeEventListener('change', onResize); };
  }, [open]);

  return (
    <>
      <a href="#main-content" className={styles.skip}>Zum Inhalt</a>
      <header className={styles.header}>
        <Link href="/" onClick={() => setOpen(false)} className={styles.brand} aria-label="G3 CrossFit Berlin – Startseite"><Image src="/logo.png" alt="" width={54} height={54} priority /><span>G3 CrossFit<small>Berlin am Gleisdreieck</small></span></Link>
        <nav className={styles.desktopNav} aria-label="Hauptnavigation">{navigation.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}</nav>
        <Link href={studio.trialHref} onClick={() => setOpen(false)} className={styles.headerCta}>Probetraining <ArrowUpRight aria-hidden="true" size={18} /></Link>
        <button ref={toggle} type="button" className={styles.menuToggle} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Menü schließen' : 'Menü öffnen'}>{open ? <X size={25} /> : <Menu size={25} />}</button>
        <nav ref={panel} id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile Hauptnavigation" hidden={!open}>{navigation.map((item) => <Link href={item.href} key={item.label} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={22} aria-hidden="true" /></Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Kontakt<ArrowUpRight size={22} aria-hidden="true" /></Link></nav>
      </header>
    </>
  );
}
