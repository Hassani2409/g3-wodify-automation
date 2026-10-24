'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, UserRound, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import s from './ClubChrome.module.css';
const links = [['Training','/training'],['Über uns','/about'],['Coaches','/coaches'],['Preise','/pricing'],['Shop','/shop'],['Kontakt','/contact']];
export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); ref.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (!menu.current?.contains(e.target as Node) && !ref.current?.contains(e.target as Node)) setOpen(false); };
    const mq = matchMedia('(min-width: 1101px)');
    const resize = () => { if (mq.matches) setOpen(false); };
    window.addEventListener('keydown',key);window.addEventListener('pointerdown',outside);mq.addEventListener('change',resize);
    return () => {window.removeEventListener('keydown',key);window.removeEventListener('pointerdown',outside);mq.removeEventListener('change',resize);};
  },[open]);
  return <><a className={s.skip} href="#main-content">Zum Inhalt</a><header className={s.header}>
    <Link href="/" className={s.brand} aria-label="G3 CrossFit – Startseite" onClick={()=>setOpen(false)}><Image src="/logo.png" alt="" width={48} height={60} priority /><span>G3 CrossFit<small>Berlin am Gleisdreieck</small></span></Link>
    <nav className={s.desktop} aria-label="Hauptnavigation">{links.map(([label,href])=><Link href={href} key={href} aria-current={pathname===href?'page':undefined}>{label}</Link>)}</nav>
    <div className={s.utilities}><Link href="/shop/wishlist" aria-label="Merkliste"><Heart size={19}/></Link><Link href="/shop/cart" aria-label="Warenkorb"><ShoppingBag size={19}/></Link><Link href={user?'/dashboard':'/login'} aria-label={user?'Mitgliederbereich':'Anmelden'}><UserRound size={19}/></Link></div>
    <Link href="/contact#booking" className={s.cta} onClick={()=>setOpen(false)}>Probetraining</Link>
    <button ref={ref} className={s.toggle} aria-expanded={open} aria-controls="club-navigation" aria-label={open?'Menü schließen':'Menü öffnen'} onClick={()=>setOpen(!open)}>{open?<X size={24}/>:<Menu size={24}/>}</button>
    <nav ref={menu} className={s.mobile} id="club-navigation" hidden={!open} aria-label="Mobile Hauptnavigation">{links.map(([label,href])=><Link href={href} key={href} onClick={()=>setOpen(false)} aria-current={pathname===href?'page':undefined}>{label}</Link>)}<div><Link href="/shop/cart" onClick={()=>setOpen(false)}>Warenkorb</Link><Link href="/shop/wishlist" onClick={()=>setOpen(false)}>Merkliste</Link><Link href={user?'/dashboard':'/login'} onClick={()=>setOpen(false)}>{user?'Mitgliederbereich':'Anmelden'}</Link></div></nav>
  </header></>;
}
