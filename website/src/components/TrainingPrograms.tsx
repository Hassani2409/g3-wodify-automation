import Image from "next/image";
import trainingImage from "../../public/images/g3-training.jpg";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { trainingPrograms, site } from "@/lib/site";
import { Button } from "@/components/ui/button";

const HOME_PROGRAMS = ["crossfit-advanced", "olympic-lifting", "yoga", "team-wods"];

export default function TrainingPrograms({ detailed = false }: { detailed?: boolean }) {
  if (detailed) return <DetailedPrograms />;

  const programs = trainingPrograms.filter(p => HOME_PROGRAMS.includes(p.id));
  return <section id="training-programmes" className="py-20 lg:py-28 bg-card scroll-mt-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
      <figure className="lg:col-span-5 lg:sticky lg:top-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-primary-900">
          <Image src={trainingImage} placeholder="blur" alt="Kletterseile vor der dunklen Wand in der G3 Box" fill
            sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 100vw" className="object-cover object-[22%_center]" />
        </div>
        <figcaption className="mt-3 text-xs text-muted-foreground">In der G3 Box am Gleisdreieck.</figcaption>
      </figure>

      <div className="lg:col-span-7">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground text-balance">Unsere Trainingsprogramme</h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl">
          Kleine Gruppen mit maximal {site.maxParticipants} Personen. Bei nur einer Anmeldung wird der Kurs zum Personal Training ohne Aufpreis.
        </p>

        <ol className="mt-10 border-t border-border">
          {programs.map((program, index) => <li key={program.id} className="border-b border-border">
            <Link href={`/training#${program.id}`}
              className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 py-6 min-h-11 transition-colors duration-150 ease-out [@media(hover:hover)]:hover:bg-primary-50 -mx-4 px-4 rounded-md">
              <span className="font-heading text-lg text-primary-600 tabular-nums" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-2xl md:text-3xl font-heading font-semibold text-foreground">{program.title}</span>
                <span className="block mt-1 text-muted-foreground">{program.description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-5 text-primary-700 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5" />
            </Link>
          </li>)}
        </ol>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-600 min-h-12">
            <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowRight aria-hidden="true" /></Link>
          </Button>
          <Link href="/training" className="inline-flex items-center min-h-11 text-primary-700 underline underline-offset-4">Alle Angebote ansehen</Link>
          <Link href={site.scheduleUrl} className="inline-flex items-center min-h-11 text-primary-700 underline underline-offset-4">Kursplan ansehen</Link>
        </div>
      </div>
    </div>
  </section>;
}

const GROUPS: { title: string; intro: string; ids: string[] }[] = [
  { title: "Einsteigen", intro: "Für deine ersten Wochen oder wenn du lieber allein mit einem Coach arbeitest.", ids: ["crossfit-beginner", "personal-training"] },
  { title: "Gemeinsam trainieren", intro: "Die Kurse, in denen die Community zusammenkommt.", ids: ["crossfit-advanced", "team-wods", "endurance", "gymnastics"] },
  { title: "Kraft und Technik", intro: "Gezielt an Hantel und Muskulatur arbeiten.", ids: ["olympic-lifting", "strength-conditioning"] },
  { title: "Ausgleich und freies Training", intro: "Beweglich bleiben oder eigene Ziele verfolgen.", ids: ["yoga", "open-gym"] },
];

function DetailedPrograms() {
  const byId = new Map(trainingPrograms.map(p => [p.id, p]));
  return <section className="pb-24 scroll-mt-20"><div className="max-w-6xl mx-auto px-6 lg:px-8">
    {GROUPS.map(group => <div key={group.title} className="grid gap-6 lg:grid-cols-12 py-12 border-t-2 border-ink first:border-t-2">
      <header className="lg:col-span-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-none">{group.title}</h2>
        <p className="mt-3 text-muted-foreground max-w-[30ch]">{group.intro}</p>
      </header>
      <ul className="lg:col-span-8 divide-y divide-border">
        {group.ids.map(id => byId.get(id)).filter(Boolean).map(program => <li key={program!.id} id={program!.id} className="scroll-mt-28 py-5 first:pt-0 grid sm:grid-cols-[13rem_1fr] gap-x-8 gap-y-1 items-baseline">
          <h3 className="text-2xl font-heading font-semibold text-foreground">{program!.title}</h3>
          <p className="text-muted-foreground">{program!.description}</p>
        </li>)}
      </ul>
    </div>)}
    <div className="border-t-2 border-ink pt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-600 min-h-12">
        <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowRight aria-hidden="true" /></Link>
      </Button>
      <Link href={site.scheduleUrl} className="inline-flex items-center min-h-11 text-primary-700 underline underline-offset-4">Kursplan ansehen</Link>
    </div>
  </div></section>;
}
