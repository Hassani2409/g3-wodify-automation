import { Info } from "lucide-react";

/** Marks sample content so it cannot be mistaken for real G3 articles or member stories. */
export default function DemoContentNotice({ className = "" }: { className?: string }) {
  return (
    <div role="note" className={`flex gap-3 items-start rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 ${className}`}>
      <Info className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-body">
        <strong>Beispielinhalte:</strong> Dieser Blog zeigt, wie Artikel bei G3 aussehen können. Autor:innen und
        Geschichten sind Platzhalter, keine echten Personen oder Erfahrungsberichte. Echte Beiträge erscheinen erst nach
        Freigabe durch das G3-Team.
      </p>
    </div>
  );
}
