'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Plus, MapPin, Check, Phone } from 'lucide-react';
import { studio } from '@/lib/studio';
import styles from './PremiumHome.module.css';

const programs = [
  { name: 'CrossFit', title: 'Jeden Tag etwas Neues', text: 'Kraft, Ausdauer und Körperbeherrschung in einem Workout. Dein Coach passt Übungen und Intensität an dein Level an.', image: '/images/g3/community.jpg', alt: 'Kettlebell-Training bei G3 CrossFit', detail: 'Gemeinsam trainieren. Individuell begleitet.' },
  { name: 'Weightlifting', title: 'Technik vor Gewicht', text: 'Reißen, Stoßen und saubere Grundlagen. Arbeite an Bewegungen, die Präzision brauchen, mit einem Coach an deiner Seite.', image: '/images/g3/training.jpg', alt: 'Seile und Trainingsbereich der G3 Box', detail: 'Kontrolle aufbauen. Schritt für Schritt.' },
  { name: 'Personal Training', title: 'Dein Ziel im Mittelpunkt', text: 'Du möchtest gezielt an deiner Technik oder Fitness arbeiten? Im persönlichen Training richtet sich die Einheit nach dir.', image: '/images/g3/coach.jpg', alt: 'G3 Coach in der Box', detail: 'Persönliches Coaching für deinen nächsten Schritt.' },
  { name: 'Yoga & Mobility', title: 'Raum für Bewegung', text: 'Beweglichkeit und Erholung gehören zum Training dazu. Ergänze deine Workouts mit Yoga und bewusster Bewegung.', image: '/images/g3/training.jpg', alt: 'Einblick in die G3 CrossFit Box', detail: 'Beweglicher werden. Bewusst regenerieren.' },
];

const questions = [
  ['Muss ich schon fit sein?', 'Nein. Im persönlichen Probetraining lernen wir dich und deine Ziele kennen. Übungen und Belastung werden auf deine Erfahrung und dein aktuelles Fitnesslevel abgestimmt.'],
  ['Wie läuft das Probetraining ab?', 'Du sprichst mit einem Trainer über deine Ziele und deine Erfahrung. Danach lernst du das Training kennen. Das Probetraining ist kostenlos und unverbindlich. Deinen Termin stimmen wir persönlich mit dir ab.'],
  ['Was soll ich mitbringen?', 'Bequeme Sportkleidung, saubere Trainingsschuhe, etwas zu trinken und ein Handtuch. Falls du vorab Fragen hast, schreib uns oder ruf kurz an.'],
  ['Kann ich auch mit Erfahrung einsteigen?', 'Ja. Wenn du bereits CrossFit trainierst oder die Box wechseln möchtest, schauen wir gemeinsam, wie du bei G3 einsteigen kannst. Auch Drop-ins sind möglich.'],
  ['Wie finde ich die Box?', 'Du findest uns am Tempelhofer Ufer 36 in Berlin, im zweiten Hinterhaus in der ersten Etage. Die U-Bahnhöfe Gleisdreieck und Mendelssohn-Bartholdy-Park liegen in der Nähe.'],
];

export default function PremiumHome() {
  const root = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState(0);
  const [student, setStudent] = useState(false);
  const [frequency, setFrequency] = useState(0);
  const [experience, setExperience] = useState<'new' | 'experienced'>('new');
  const selected = programs[program];
  const prices = student ? [90, 105, 120] : [100, 120, 140];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches || !root.current || !('IntersectionObserver' in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        const index = Number(element.dataset.delay || 0);
        animations.push(element.animate(
          [{ opacity: 0.25, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 700, delay: index * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
        ));
        observer.unobserve(element);
      }
    }, { threshold: 0.12 });
    root.current.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
    const stopMotion = () => { if (mq.matches) animations.forEach((animation) => animation.cancel()); };
    mq.addEventListener('change', stopMotion);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); mq.removeEventListener('change', stopMotion); };
  }, []);

  return (
    <div ref={root} className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <h1 id="home-title">Stärker.<br />Zusammen.</h1>
          <p className={styles.heroDescription}>Deine CrossFit Box am Berliner Gleisdreieck. Persönliches Coaching, kleine Gruppen und Menschen, die dich mitziehen.</p>
          <Link href={studio.trialHref} className={styles.primary}>Probetraining anfragen <ArrowUpRight aria-hidden="true" size={21} /></Link>
          <p className={styles.heroNote}>Kostenlos. Persönlich. Für jedes Level.</p>
          <a className={styles.heroLocation} href="#anfahrt"><MapPin size={17} aria-hidden="true" /> Berlin · Tempelhofer Ufer 36</a>
        </div>
        <div className={styles.heroVisual}>
          <Image src="/images/g3/community.jpg" alt="Ein G3 Coach demonstriert eine Kettlebell-Übung" fill priority sizes="(max-width: 760px) 100vw, 55vw" className={styles.heroImage} />
          <div className={styles.photoWord} aria-hidden="true">G3</div>
          <span className={styles.photoCaption}>Dein nächster Schritt beginnt hier.</span>
        </div>
      </section>

      <section id="box" className={`${styles.intro} ${styles.section}`} aria-labelledby="box-title">
        <div className={styles.introHeading} data-reveal>
          <h2 id="box-title">Hier kennt man<br />deinen Namen.</h2>
          <p>Du kommst fürs Training.<br />Du bleibst wegen der Menschen.</p>
        </div>
        <div className={styles.introContent}>
          <p className={styles.lead} data-reveal>Mitten in Berlin. Ein bisschen versteckt im Hinterhof. Und genau der richtige Ort, um über dich hinauszuwachsen.</p>
          <p data-reveal data-delay="1">Bei G3 trainierst du in Gruppen mit maximal acht Personen. Dein Coach sieht hin, erklärt dir die Technik und passt das Workout an dich an. Ob erster Squat oder nächster persönlicher Meilenstein: Du gehst deinen Weg gemeinsam mit uns.</p>
          <div className={styles.factRow} data-reveal data-delay="2"><span>Maximal <strong>8</strong> im Kurs</span><span><strong>1:1</strong> kennenlernen</span></div>
        </div>
      </section>

      <section id="training" className={`${styles.training} ${styles.section}`} aria-labelledby="training-title">
        <div className={styles.sectionTop} data-reveal><h2 id="training-title">Finde deinen Rhythmus.</h2><Link href={studio.trialHref} className={styles.textLink}>Deinen Einstieg besprechen <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className={styles.programLayout}>
          <div className={styles.programMenu} aria-label="Trainingsangebote">
            {programs.map((item, index) => <button key={item.name} type="button" aria-pressed={program === index} aria-controls="program-detail" onClick={() => setProgram(index)} className={`${styles.programButton} ${program === index ? styles.activeProgram : ''}`}><span>{item.name}</span><ArrowUpRight size={24} aria-hidden="true" /></button>)}
            <p className={styles.programHint}>Verschiedene Schwerpunkte.<br />Eine gemeinsame Haltung.</p>
          </div>
          <div className={styles.programDetail} id="program-detail" aria-live="polite" aria-atomic="true">
            <div className={styles.programPhoto}><Image key={selected.image} src={selected.image} alt={selected.alt} fill sizes="(max-width: 760px) 100vw, 55vw" style={{ objectFit: 'cover', objectPosition: program === 0 ? '50% 27%' : 'center' }} /></div>
            <div className={styles.programCopy}><div><h3>{selected.title}</h3><p>{selected.text}</p></div><span>{selected.detail}</span></div>
          </div>
        </div>
      </section>

      <section id="team" className={styles.team} aria-labelledby="team-title">
        <div className={styles.teamPhoto} data-reveal><Image src="/images/g3/team.jpg" alt="G3 Trainerteam zusammen in der Box" fill sizes="(max-width: 760px) 100vw, 58vw" /></div>
        <div className={styles.teamCopy}><h2 id="team-title" data-reveal>Coaching.<br />Ganz persönlich.</h2><p data-reveal data-delay="1">Gutes Coaching beginnt mit Zuhören. Wir möchten wissen, was dich antreibt, wo du stehst und was du erreichen willst. Dann arbeiten wir gemeinsam daran.</p><Link href={studio.trialHref} className={styles.textLink} data-reveal data-delay="2">Uns persönlich kennenlernen <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>

      <section id="einstieg" className={`${styles.trial} ${styles.section}`} aria-labelledby="trial-title">
        <div className={styles.trialIntro}><h2 id="trial-title" data-reveal>Dein erster Tag.<br />Ganz ohne Druck.</h2><p data-reveal>Du musst nichts beweisen. Komm vorbei, lerne uns kennen und finde heraus, ob G3 zu dir passt.</p><div className={styles.choiceGroup} aria-label="Deine CrossFit-Erfahrung"><button type="button" aria-pressed={experience === 'new'} onClick={() => setExperience('new')}>Ich starte neu</button><button type="button" aria-pressed={experience === 'experienced'} onClick={() => setExperience('experienced')}>Ich trainiere schon</button></div><p className={styles.experienceCopy} aria-live="polite">{experience === 'new' ? 'Wir zeigen dir die Grundlagen und finden gemeinsam deinen Einstieg. Dein aktuelles Fitnesslevel ist genau der richtige Ausgangspunkt.' : 'Du bringst Erfahrung mit? Dann lernen wir deine Ziele kennen und schauen, wie du dein Training bei uns fortsetzen kannst.'}</p><Link href={studio.trialHref} className={styles.darkButton}>Probetraining anfragen <ArrowUpRight size={20} aria-hidden="true" /></Link></div>
        <ol className={styles.steps}>
          {[['Wir lernen dich kennen.', 'Erzähl uns von deinen Zielen. Gemeinsam besprechen wir deine Erfahrung und offene Fragen.'], ['Du erlebst das Training.', 'Ein Trainer begleitet dich durch dein erstes Workout. Die Übungen richten sich nach dir.'], ['Du entscheidest in Ruhe.', 'Hat es gepasst? Dann finden wir die passende Mitgliedschaft. Dein Probetraining bleibt unverbindlich.']].map(([title, text], index) => <li key={title} data-reveal data-delay={index}><span className={styles.stepNumber} aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ol>
      </section>

      <section id="preise" className={`${styles.pricing} ${styles.section}`} aria-labelledby="pricing-title">
        <div className={styles.priceIntro}><h2 id="pricing-title" data-reveal>Platz für<br />dein Training.</h2><p data-reveal>Wähle, wie oft du kommen möchtest. Coaching und die Atmosphäre der Box gehören immer dazu.</p><p className={styles.priceNote}>Monatspreise bei 12 Monaten Laufzeit. Bei 6 Monaten Laufzeit jeweils 10 € mehr pro Monat.</p></div>
        <div className={styles.priceSelector}>
          <div className={styles.choiceGroup} aria-label="Mitgliedschaftsart"><button type="button" aria-pressed={!student} onClick={() => setStudent(false)}>Regulär</button><button type="button" aria-pressed={student} onClick={() => setStudent(true)}>Studierende</button></div>
          <fieldset className={styles.frequency}><legend>Wie oft möchtest du trainieren?</legend>{['2 × pro Woche', '3 × pro Woche', 'Unlimited'].map((label, index) => <label key={label}><input type="radio" name="frequency" checked={frequency === index} onChange={() => setFrequency(index)} /><span>{label}</span><span>{prices[index]} €</span></label>)}</fieldset>
          <div className={styles.priceTotal} aria-live="polite" aria-atomic="true"><span>{prices[frequency]}<span> €</span></span><p>pro Monat<br />{student ? 'für Studierende' : 'reguläre Mitgliedschaft'}</p></div>
          <p className={styles.priceIncludes}><Check size={18} aria-hidden="true" /> Persönlich angeleitetes Gruppentraining</p>
          <Link href={studio.trialHref} className={styles.primary}>Erst einmal kennenlernen <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={`${styles.faq} ${styles.section}`} aria-labelledby="faq-title"><h2 id="faq-title" data-reveal>Noch eine Frage?</h2><div>{questions.map(([question, answer]) => <details key={question} className={styles.question} data-reveal><summary>{question}<Plus size={22} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

      <section id="anfahrt" className={styles.visit} aria-labelledby="visit-title"><div className={styles.visitPhoto}><Image src="/images/g3/training.jpg" alt="Die Trainingsseile und Kreidewand in der G3 Box" fill sizes="(max-width: 760px) 100vw, 45vw" /></div><div className={styles.visitCopy}><h2 id="visit-title" data-reveal>Wir sehen uns<br />im Hinterhof.</h2><p data-reveal>{studio.street}<br />{studio.postcode} {studio.city}<br /><span>{studio.entrance}</span></p><div className={styles.visitActions} data-reveal><a href={studio.maps} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Route öffnen <ArrowUpRight size={19} aria-hidden="true" /></a><a href={studio.phoneHref} className={styles.textLink}><Phone size={17} aria-hidden="true" /> {studio.phone}</a></div><Link href={studio.trialHref} className={styles.primary} data-reveal>Probetraining anfragen <ArrowRight size={20} aria-hidden="true" /></Link></div></section>
    </div>
  );
}
