import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { getPublicCalendarUrl } from "@/lib/public-calendar";

export const metadata = { title: "Kursplan" };

export default function SchedulePage() {
  const calendarUrl = getPublicCalendarUrl(process.env.NEXT_PUBLIC_WODIFY_CALENDAR_URL);
  return <section className="min-h-svh pt-32 pb-20 bg-background">
    <div className="max-w-3xl mx-auto px-6 lg:px-8">
      <h1 className="text-5xl font-heading font-bold text-foreground mb-6">Dein Kursplan in Wodify</h1>
      <p className="text-lg text-muted-foreground mb-6">Kurse, Zeiten und freie Plätze prüfst du direkt in Wodify. Als Mitglied findest du dort auch deine Buchungen.</p>
      {calendarUrl ? <Button asChild className="mb-8"><a href={calendarUrl} target="_blank" rel="noopener noreferrer">Wodify-Kalender öffnen</a></Button> : <div className="border border-border rounded-card p-6 mb-8">
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">Öffentlicher Kalender noch nicht verfügbar</h2>
        <p className="text-muted-foreground">Bitte öffne die Wodify-App mit deinem Mitgliedskonto oder frage unser Team nach den aktuellen Trainingszeiten.</p>
      </div>}
      <div className="flex flex-wrap gap-3 mb-6"><Button asChild className="bg-accent text-accent-foreground hover:bg-accent-600"><Link href="/contact#booking">Probetraining anfragen</Link></Button><Button asChild variant="outline"><a href={`mailto:${site.email}`}>Team kontaktieren</a></Button></div>
      <p className="text-muted-foreground">Du erreichst uns auch telefonisch unter <a href={site.phoneHref} className="text-primary-700 underline underline-offset-4">{site.phone}</a>.</p>
    </div>
  </section>;
}
