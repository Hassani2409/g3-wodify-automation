import { site } from "@/lib/site";
export default function Directions() {
  return <section className="py-16 bg-primary-50" aria-labelledby="directions-title">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-8 md:grid-cols-2">
      <div><h2 id="directions-title" className="text-3xl font-heading font-bold text-foreground mb-4">So findest du uns</h2>
        <p className="text-foreground font-body">{site.street}, {site.postalCode} {site.city}<br />{site.entrance}</p>
        <p className="text-muted-foreground mt-4">Am Gleisdreieck, nahe Potsdamer Platz – gut erreichbar aus Mitte, Kreuzberg und Schöneberg.</p>
        <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-primary-700 underline underline-offset-4">Route in Google Maps öffnen</a>
      </div>
      <ul className="space-y-4 text-foreground font-body self-center">
        <li><strong>U1 / U2</strong><br />Gleisdreieck oder Mendelssohn-Bartholdy-Park</li>
        <li><strong>S1 / S2 / S25</strong><br />Anhalter Bahnhof</li>
        <li><strong>Bus M29</strong><br />Schöneberger Brücke</li>
      </ul>
    </div>
  </section>;
}
