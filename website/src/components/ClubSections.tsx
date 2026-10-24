'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import s from './Club.module.css';

export function ClubMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !ref.current) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animations.push(entry.target.animate([{ opacity: .55, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' }));
      observer.unobserve(entry.target);
    }), { threshold: .12 });
    ref.current.querySelectorAll('[data-club-reveal]').forEach(el => observer.observe(el));
    const stop = () => { if (media.matches) { observer.disconnect(); animations.forEach(a => a.cancel()); } };
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach(a => a.cancel()); media.removeEventListener('change', stop); };
  }, []);
  return <div ref={ref} className={s.club}>{children}</div>;
}

export function HeroSection() {
  return <section className={s.hero} aria-labelledby="hero-title">
    <div className={s.heroText}>
      <h1 id="hero-title">Dein CrossFit Gym.<br />Mitten in Berlin.</h1>
      <p>Persönliches Coaching. Kleine Gruppen. Eine Box, in der du ankommst – und gemeinsam mit anderen stärker wirst.</p>
      <div className={s.actions}><Link className={s.button} href="/contact#booking">Kostenloses Probetraining <ArrowUpRight size={20} aria-hidden="true" /></Link><Link className={s.lightLink} href="/training">Training entdecken <ArrowRight size={18} aria-hidden="true" /></Link></div>
    </div>
    <div className={s.heroPhotos}>
      <div className={s.mainPhoto}><Image src="/images/g3/team.jpg" alt="Das G3 CrossFit Team gemeinsam in der Berliner Box" fill priority sizes="(max-width: 700px) 100vw, 76vw" /></div>
      <div className={s.sidePhoto}><Image src="/images/g3/community.jpg" alt="Ein G3 Coach bei einer Kettlebell-Übung" fill priority sizes="24vw" /></div>
    </div>
    <div className={s.photoCaption}><span>G3 CrossFit · Berlin am Gleisdreieck</span><a href="#anfahrt">Tempelhofer Ufer 36 <ArrowUpRight size={16} aria-hidden="true" /></a></div>
  </section>;
}

export function FeatureCards() {
  return <section className={`${s.section} ${s.benefits}`} aria-labelledby="benefits-title">
    <div data-club-reveal><h2 id="benefits-title">Training, das<br />zu dir passt.</h2><p>Du musst nicht erst fit werden, um anzufangen.</p></div>
    <div className={s.benefitList}>
      <div data-club-reveal><h3>Kleine Gruppen</h3><p>Maximal acht Personen im Kurs. Dein Coach hat Zeit, hinzusehen und dich persönlich zu begleiten.</p></div>
      <div data-club-reveal><h3>Dein eigenes Level</h3><p>Übungen, Gewicht und Intensität richten sich nach deiner Erfahrung. Du trainierst mit der Gruppe und an deinen Zielen.</p></div>
      <div data-club-reveal><h3>Ein persönlicher Anfang</h3><p>Im kostenlosen Probetraining lernen wir dich kennen, erklären die Grundlagen und beantworten deine Fragen.</p></div>
    </div>
  </section>;
}

export function TrainingPrograms() {
  return <section id="training" className={`${s.section} ${s.programs}`} aria-labelledby="training-title">
    <div className={s.sectionHeading} data-club-reveal><h2 id="training-title">Unser Training.</h2><p>Funktionelle Bewegungen, saubere Technik und ein Coach an deiner Seite.</p></div>
    <div className={s.trainingRow}>
      <div className={s.trainingPhoto} data-club-reveal><Image src="/images/g3/community.jpg" alt="Kettlebell-Training in der G3 Box" fill sizes="(max-width: 700px) 100vw, 48vw" /></div>
      <div className={s.trainingCopy} data-club-reveal><h3>CrossFit</h3><p>Kraft, Ausdauer und Körperbeherrschung in einem abwechslungsreichen Workout. Gemeinsam trainieren, ohne dich mit anderen messen zu müssen.</p><Link className={s.textLink} href="/contact#booking">CrossFit kennenlernen <ArrowUpRight size={19} aria-hidden="true" /></Link></div>
    </div>
    <div className={s.trainingDetails}>
      <div data-club-reveal><h3>Olympic Weightlifting</h3><p>Reißen und Stoßen mit Zeit für die Technik. Arbeite gezielt an Bewegungsabläufen und Kontrolle.</p></div>
      <div data-club-reveal><h3>Personal Training</h3><p>Eine Einheit nur für dich. Dein Ziel und dein Trainingsstand geben den Schwerpunkt vor.</p></div>
      <div data-club-reveal><h3>Yoga & Mobility</h3><p>Beweglichkeit und bewusste Bewegung ergänzen dein Kraft- und Ausdauertraining.</p></div>
    </div>
  </section>;
}

export function AboutPreview() {
  return <section id="box" className={`${s.section} ${s.about}`} aria-labelledby="about-title">
    <div className={s.aboutCopy} data-club-reveal><h2 id="about-title">Mehr als<br />ein Trainingsort.</h2><p>Ein Hinterhof am Gleisdreieck. Menschen mit unterschiedlichen Zielen. Und die gemeinsame Entscheidung, etwas für sich zu tun.</p><p>Bei G3 zählt, dass du da bist. Wir erklären dir die Bewegungen, passen das Training an und begleiten dich bei deinen nächsten Schritten.</p><Link className={s.textLink} href="/contact">Lerne die Box kennen <ArrowUpRight size={19} aria-hidden="true" /></Link></div>
    <div className={s.aboutPhoto} data-club-reveal><Image src="/images/g3/training.jpg" alt="Trainingsseile und Kreidewand der G3 CrossFit Box" fill sizes="(max-width: 700px) 100vw, 52vw" /></div>
  </section>;
}

export function CoachPreview() {
  return <section id="team" className={`${s.section} ${s.team}`} aria-labelledby="team-title">
    <div className={s.sectionHeading} data-club-reveal><h2 id="team-title">Menschen, die<br />dich begleiten.</h2><div><p>Coaching heißt für uns: zuhören, erklären und gemeinsam herausfinden, was dich weiterbringt.</p><Link className={s.textLink} href="/contact#booking">Persönlich kennenlernen <ArrowUpRight size={19} aria-hidden="true" /></Link></div></div>
    <div className={s.teamPhoto} data-club-reveal><Image src="/images/g3/team.jpg" alt="Das G3 Trainerteam zusammen in der Box" fill sizes="100vw" /></div>
  </section>;
}

export function Testimonials() {
  return <section className={`${s.section} ${s.trial}`} aria-labelledby="trial-title">
    <div data-club-reveal><h2 id="trial-title">Dein erster Schritt.<br />Ganz persönlich.</h2><p>Dein Probetraining ist kostenlos und unverbindlich. Einen Termin stimmen wir direkt mit dir ab.</p><Link className={s.button} href="/contact#booking">Probetraining anfragen <ArrowUpRight size={20} aria-hidden="true" /></Link></div>
    <ol className={s.steps}>
      <li data-club-reveal><h3>Erzähl uns von dir.</h3><p>Schreib uns kurz, welche Erfahrung du mitbringst und was du dir vom Training wünschst.</p></li>
      <li data-club-reveal><h3>Lerne G3 kennen.</h3><p>Ein Coach zeigt dir die Grundlagen und begleitet dich durch dein erstes Training.</p></li>
      <li data-club-reveal><h3>Entscheide in Ruhe.</h3><p>Wenn es für dich passt, besprechen wir deinen Einstieg und die passende Mitgliedschaft.</p></li>
    </ol>
  </section>;
}

export function Visit() {
  return <section id="anfahrt" className={`${s.section} ${s.visit}`} aria-labelledby="visit-title"><div><h2 id="visit-title">Wir sehen uns<br />im Hinterhof.</h2><p>Tempelhofer Ufer 36 · 10963 Berlin<br />2. Hinterhaus, 1. Etage</p></div><div><p>Fragen vor deinem ersten Besuch?</p><a className={s.textLink} href="tel:+491605571866">0160 55 718 66 <ArrowUpRight size={19} aria-hidden="true" /></a><a className={s.textLink} href="mailto:info@g3crossfit.com">info@g3crossfit.com <ArrowUpRight size={19} aria-hidden="true" /></a></div></section>;
}
