import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { coaches } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Coaches", description: "Das Coaching-Team von G3 CrossFit am Gleisdreieck." };

export default function CoachesPage() {
  return <div className="pt-32 pb-24 min-h-svh">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <h1 className="font-heading font-bold text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] mb-5">Die Leute an der Tafel</h1>
      <p className="text-lg text-muted-foreground max-w-[52ch] mb-12">Sie schreiben das Workout an, zeigen dir die Bewegungen und passen jede Übung an dich an.</p>
      <figure className="mb-14">
        <Image src="/images/g3-team.jpg" alt="Das Coaching-Team von G3 CrossFit" width={1200} height={809} sizes="(max-width: 1200px) 100vw, 1150px" className="w-full rounded-card" priority />
        <figcaption className="mt-3 text-sm text-muted-foreground">Das G3-Team in der Box.</figcaption>
      </figure>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-ink mb-14">
        {coaches.map(coach => <li key={coach.name} className="py-6 pr-6 border-b border-border">
          <h2 className="text-3xl font-heading font-bold leading-none">{coach.name}</h2>
          <p className="text-muted-foreground mt-2">{coach.role}</p>
        </li>)}
      </ul>
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-600 min-h-12">
        <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowRight aria-hidden="true" /></Link>
      </Button>
    </div>
  </div>;
}
