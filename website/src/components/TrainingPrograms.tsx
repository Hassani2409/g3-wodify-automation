import Link from "next/link";
import { trainingPrograms, site } from "@/lib/site";
import { Button } from "@/components/ui/button";
export default function TrainingPrograms({ detailed = false }: { detailed?: boolean }) {
  const programs = detailed ? trainingPrograms : trainingPrograms.filter(p => ["crossfit-advanced", "olympic-lifting", "yoga", "team-wods"].includes(p.id));
  return <section className="py-20 bg-card"><div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Unsere Trainingsprogramme</h2>
    <p className="text-muted-foreground mb-10">Kleine Gruppen mit maximal {site.maxParticipants} Personen. Bei nur einer Anmeldung wird der Kurs zum Personal Training ohne Aufpreis.</p>
    <div className="grid md:grid-cols-2 gap-8">{programs.map(program => <article key={program.id} id={detailed ? program.id : undefined} className="border border-border rounded-card p-6">
      <h3 className="text-2xl font-heading font-semibold text-foreground">{program.title}</h3><p className="text-muted-foreground mt-3 mb-6">{program.description}</p>
      <div className="flex flex-wrap gap-3"><Button asChild><Link href="/contact#booking">Probetraining anfragen</Link></Button>{!detailed && <Button asChild variant="outline"><Link href={`/training#${program.id}`}>Mehr erfahren</Link></Button>}</div>
    </article>)}</div>
    <a href={site.scheduleUrl} className="inline-block mt-8 text-primary-700 underline underline-offset-4">Kursplan ansehen</a>
  </div></section>;
}
