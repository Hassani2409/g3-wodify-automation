import Link from "next/link";
import { Button } from "@/components/ui/button";
const rates = [{ name: "2× pro Woche", regular: 100, student: 90 }, { name: "3× pro Woche", regular: 120, student: 105 }, { name: "Unlimited", regular: 140, student: 120 }];
export default function PricingPage() { return <div className="pt-28 min-h-svh max-w-5xl mx-auto px-6 pb-20">
  <h1 className="text-5xl font-heading font-bold mb-6">Mitgliedschaften und Preise</h1>
  <p className="text-muted-foreground mb-8">Veröffentlichte Preise auf g3crossfit.com, abgerufen am 24. Oktober 2026. Bitte lass dir vor Vertragsabschluss die aktuellen Konditionen bestätigen.</p>
  <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><caption className="text-left font-semibold mb-4">Monatspreise bei 12 Monaten Laufzeit</caption><thead><tr className="border-b border-border"><th className="p-4">Training</th><th className="p-4">Regulär</th><th className="p-4">Studierende</th></tr></thead><tbody>{rates.map(rate => <tr key={rate.name} className="border-b border-border"><th className="p-4 font-medium">{rate.name}</th><td className="p-4 tabular-nums">{rate.regular} €</td><td className="p-4 tabular-nums">{rate.student} €</td></tr>)}</tbody></table></div>
  <p className="mt-6 text-muted-foreground">Bei sechs Monaten Laufzeit: jeweils 10 € mehr pro Monat. Weitere veröffentlichte Optionen: Drop-in 24 € pro Besuch und Personal Training 119 € pro Stunde.</p>
  <a href="https://g3crossfit.com/mitgliedschaft/" className="block mt-4 mb-8 text-primary-700 underline underline-offset-4">Preise auf der Originalseite ansehen</a>
  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-600"><Link href="/contact#booking">Kostenloses Probetraining anfragen</Link></Button>
</div>; }
