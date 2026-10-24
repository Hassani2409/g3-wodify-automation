import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import styles from "./FeatureCards.module.css";

const benefits = [
  {
    title: "Kleine Gruppen. Viel Aufmerksamkeit.",
    description: `Maximal ${site.maxParticipants} Personen pro Kurs. Wenn du allein angemeldet bist, wird daraus Personal Training – ohne Aufpreis.`,
  },
  {
    title: "Coaching, das genau hinschaut.",
    description: "Unsere zertifizierten Coaches begleiten dein Training. Technikfeedback, Videoanalyse und Fehlerkorrektur helfen dir, gezielt an deinen Bewegungen zu arbeiten.",
  },
  {
    title: "Dein Level. Dein Einstieg.",
    description: "Vom ersten Workout bis zum erfahrenen Athleten: Wir passen die Übungen an dein Fitnesslevel an. Du trainierst gemeinsam mit der Community.",
  },
];

export default function FeatureCards() {
  return (
    <section className={styles.section} aria-labelledby="why-g3-heading">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="why-g3-heading">Dein Training.<br />Persönlich begleitet.</h2>
          <p>Warum G3 CrossFit? Weil wir dich und dein Training im Blick haben. Mitten am Gleisdreieck.</p>
        </header>

        <figure className={styles.photo}>
          <div className={styles.imageFrame}>
            <Image
              src="/images/g3-gym.jpg"
              alt="Athlet bei einer Kettlebell-Übung im G3 CrossFit"
              fill
              sizes="(min-width: 1280px) 560px, (min-width: 900px) 46vw, 100vw"
              className={styles.image}
            />
          </div>
          <figcaption>Training bei G3 CrossFit am Gleisdreieck.</figcaption>
        </figure>

        <div className={styles.details}>
          <ul className={styles.benefits}>
            {benefits.map(benefit => (
              <li key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Button asChild className={styles.primaryAction}>
              <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
            <Link className={styles.scheduleLink} href={site.scheduleUrl}>Aktuellen Kursplan ansehen <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
