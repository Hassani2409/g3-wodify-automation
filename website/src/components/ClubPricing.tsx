'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {ClubMotion,Testimonials} from './ClubSections';
import s from './Club.module.css';
export default function ClubPricing(){
 const [student,setStudent]=useState(false); const [six,setSix]=useState(false); const [selected,setSelected]=useState(0);
 const prices=(student?[90,105,120]:[100,120,140]).map(n=>n+(six?10:0));
 const labels=['2 × pro Woche','3 × pro Woche','Unlimited'];
 return <ClubMotion><header className={s.pageTitle}><h1>Platz für dein Training.</h1><p>Wähle, wie oft du kommen möchtest. Deinen Einstieg besprechen wir am liebsten persönlich mit dir.</p></header><section className={s.section} aria-label="Mitgliedschaften"><div className={s.priceControls} role="group" aria-label="Mitgliedschaftsart"><button aria-pressed={!student} onClick={()=>setStudent(false)}>Regulär</button><button aria-pressed={student} onClick={()=>setStudent(true)}>Studierende</button></div><p>Laufzeit wählen</p><div className={s.priceControls} role="group" aria-label="Vertragslaufzeit"><button aria-pressed={!six} onClick={()=>setSix(false)}>12 Monate</button><button aria-pressed={six} onClick={()=>setSix(true)}>6 Monate</button></div><div className={s.priceGrid} role="group" aria-label="Trainingshäufigkeit">{labels.map((label,i)=><button key={label} className={s.priceOption} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>{label}</span><strong>{prices[i]} €</strong></button>)}</div><div aria-live="polite" aria-atomic="true"><p className={s.priceDescription}>{labels[selected]}: <strong>{prices[selected]} € pro Monat</strong> bei {six?6:12} Monaten Laufzeit{student?' für Studierende':''}.</p></div><p className={s.priceDescription}>Im kostenlosen Probetraining lernst du die Box kennen. Danach klären wir gemeinsam deine Mitgliedschaft und die Vertragsdetails.</p><Link className={s.button} href="/contact#booking">Erst einmal kennenlernen <ArrowUpRight size={20} aria-hidden="true"/></Link></section><Testimonials/></ClubMotion>
}
