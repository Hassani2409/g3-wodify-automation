import type { Metadata } from "next";
import TrainingPrograms from "@/components/TrainingPrograms";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Training", description: "CrossFit, Weightlifting, Yoga und mehr bei G3 CrossFit am Gleisdreieck – in Gruppen mit höchstens 8 Personen." };

export default function TrainingPage() {
  return <div className="pt-32 min-h-svh">
    <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-14">
      <h1 className="font-heading font-bold text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] text-foreground">Was du bei uns trainierst</h1>
      <p className="mt-5 text-lg text-muted-foreground max-w-[54ch]">
        Zehn Angebote, ein Prinzip: kleine Gruppen mit höchstens {site.maxParticipants} Personen und ein Coach, der jede Übung an dein Level anpasst.
      </p>
    </div>
    <TrainingPrograms detailed />
  </div>;
}
