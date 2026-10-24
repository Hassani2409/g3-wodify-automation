import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// "Familiär. Freudig. Fit." is G3's own philosophy line from g3crossfit.com;
// the explanations paraphrase what the original site says about each value.
const values = [
  {
    title: "Familiär.",
    description: "Man kennt sich und schätzt sich. In kleinen Gruppen bist du nicht einer von vielen.",
  },
  {
    title: "Freudig.",
    description: "Hart trainieren und dabei Spaß haben – bei Team-WODs und in jedem Kurs.",
  },
  {
    title: "Fit.",
    description: "Die Coaches unterstützen dich bei Technik, Zielen, Ernährung und Motivation.",
  },
];

export default function AboutPreview() {
  return (
    <section className="bg-primary-900 text-white py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
        <figure className="lg:col-span-7">
          <div className="relative aspect-[3797/2560] overflow-hidden rounded-card">
            <Image src="/images/g3-team.jpg" alt="Das G3 CrossFit Trainerteam in G3-Shirts vor der dunklen Wand der Box" fill
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-xs text-primary-100">Das Team im G3.</figcaption>
        </figure>

        <div className="lg:col-span-5">
          <p className="text-sm font-medium tracking-wide uppercase text-accent">Über uns</p>
          <h2 id="about-heading" className="mt-4 text-4xl md:text-5xl font-heading font-bold text-balance">Mehr als nur ein Gym</h2>
          <p className="mt-6 text-lg text-primary-100 leading-relaxed">
            Unsere Box am Gleisdreieck bringt Menschen aus Mitte, Kreuzberg und Schöneberg zusammen – Anfänger genauso wie erfahrene Athleten.
          </p>

          <dl className="mt-10 space-y-6">
            {values.map(value => (
              <div key={value.title} className="border-l-2 border-accent pl-5">
                <dt className="text-2xl font-heading font-semibold">{value.title}</dt>
                <dd className="mt-1 text-primary-100">{value.description}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-primary-50 min-h-12">
              <Link href="/coaches">Unser Trainerteam kennenlernen <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Link href="/about" className="inline-flex items-center min-h-11 text-white underline underline-offset-4">Mehr über uns</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
