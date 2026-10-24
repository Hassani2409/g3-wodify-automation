import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function AboutPage() {
  return <div className="pt-28 min-h-svh max-w-7xl mx-auto px-6 lg:px-8 pb-20"><section id="story"><h1 className="text-5xl font-heading font-bold mb-6">G3 CrossFit am Gleisdreieck</h1><p className="text-lg text-muted-foreground max-w-2xl mb-8">Persönliches Training, kleine Gruppen und eine familiäre Atmosphäre – nahe Potsdamer Platz, zwischen Mitte, Kreuzberg und Schöneberg.</p><Image src="/images/g3-training.jpg" alt="Einblick in die G3 CrossFit Box" width={1200} height={695} className="w-full rounded-card" sizes="(max-width: 1280px) 100vw, 1200px" /></section>
  <section id="values" className="py-14"><h2 className="text-3xl font-heading font-bold mb-4">Individuell betreut</h2><p className="text-muted-foreground">Angepasste Workouts, Fehlerkorrektur und Videoanalyse unterstützen dich bei deinen Zielen.</p></section>
  <section id="community" className="pb-14"><h2 className="text-3xl font-heading font-bold mb-4">Gemeinsam trainieren</h2><p className="text-muted-foreground">Kleine Gruppen und Team-WODs schaffen Raum für gegenseitige Unterstützung.</p></section>
  <Button asChild><Link href="/coaches">Das Trainerteam kennenlernen</Link></Button></div>;
}
