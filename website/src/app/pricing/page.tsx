import type { Metadata } from "next";
import PricingCalculator from "@/components/PricingCalculator";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Preise", description: "Mitgliedschaften bei G3 CrossFit am Gleisdreieck: 2× pro Woche, 3× pro Woche oder Unlimited." };

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 min-h-svh">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-heading font-bold text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] mb-5">Wie oft willst du trainieren?</h1>
        <p className="text-lg text-muted-foreground max-w-[52ch] mb-12">
          Wähle, wie viele Trainings pro Woche zu dir passen. Jeder Kurs hat höchstens {site.maxParticipants} Personen, und dein erstes Training ist kostenlos.
        </p>
        <PricingCalculator />
      </div>
    </div>
  );
}
