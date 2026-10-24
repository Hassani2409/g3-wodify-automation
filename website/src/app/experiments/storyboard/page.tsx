import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import storyboard from "@/data/homepage-storyboard.json";
import styles from "./storyboard.module.css";

export const metadata: Metadata = { title: "Storyboard der Startseite", robots: { index: false, follow: false } };

export default function StoryboardPage() {
  return <div className={styles.board}>
    <header className={styles.intro}>
      <h1>Eine Seite. Eine Geschichte.</h1>
      <p>{storyboard.summary}</p>
      <p>Planungsansicht · {storyboard.date} · Die Startseite wird durch dieses Storyboard nicht verändert.</p>
      <nav aria-label="Storyboard-Kapitel">{storyboard.chapters.map(c => <a key={c.id} href={`#chapter-${c.id}`}>{c.title}</a>)}<a href="#flow-prompts">Flow-Prompts</a></nav>
    </header>
    <section className={styles.film} aria-labelledby="existing-film-title">
      <div><h2 id="existing-film-title">Film A ist bereits vorhanden.</h2><p>Die zehn Sekunden bilden ein zusammenhängendes Eingangskapitel. Der generierte Raum ist ein Gestaltungskonzept. Team und echte G3-Bilder werden über klare Schnitte verbunden.</p></div>
      <video controls playsInline preload="none" poster="/sequences/g3-owner-tour/0000.webp" aria-label="Vorhandener Film A: der Inhaber führt in die inszenierte Box">
        <source src="/videos/g3-owner-tour-mobile.mp4" type="video/mp4" />
      </video>
    </section>
    <div className={styles.viewOptions} role="group" aria-label="Storyboard-Bildaufteilung">
      <label><input type="radio" name="storyboard-view" defaultChecked id="story-desktop" /> Desktop-Komposition</label>
      <label><input type="radio" name="storyboard-view" id="story-mobile" /> Schmale Bildvorschau</label>
    </div>
    <ol className={styles.chapters}>
      {storyboard.chapters.map((chapter, index) => <li key={chapter.id} id={`chapter-${chapter.id}`} className={styles.chapter}>
        <header><h2>{index + 1}. {chapter.title}</h2><p>{chapter.section} · {chapter.status}</p></header>
        <div className={styles.chapterGrid}>
          <figure className={styles.preview}>
            <div className={`${styles.picture} ${chapter.imageClass === "portrait" ? styles.portrait : ""}`}>
              {chapter.image ? <Image src={chapter.image} alt={chapter.kind} fill sizes="(max-width: 899px) 90vw, 50vw" className={styles.image} /> : <div className={styles.address}><strong>Tempelhofer Ufer 36</strong><span>10963 Berlin</span><span>2. Hinterhaus, 1. Etage</span><small>Kein echtes Außenfoto vorhanden.</small></div>}
            </div>
            <figcaption>{chapter.kind}{chapter.promptIds.length ? ` · Referenz für ${chapter.promptIds.join(", ")}, keine Vorschau eines bereits generierten neuen Clips.` : ""}</figcaption>
            <div className={styles.sceneCopy}><h3>{chapter.headline}</h3><p>{chapter.copy}</p><p className={styles.cta}>{chapter.cta}</p></div>
          </figure>
          <div className={styles.notes}>
            <h3>Bewegung und Lesefluss</h3><p>{chapter.motion}</p>
            <dl><dt>Desktop</dt><dd>{chapter.desktop}</dd><dt>Mobil</dt><dd>{chapter.mobile}</dd><dt>Übergang</dt><dd>{chapter.transition}</dd><dt>Textfläche</dt><dd>{chapter.textPosition}</dd><dt>Material</dt><dd>{chapter.film}</dd></dl>
            {chapter.promptIds.map(id => <a key={id} href={`#prompt-${id}`}>Zum Flow-Prompt {id}</a>)}
          </div>
        </div>
      </li>)}
    </ol>
    <section className={styles.prompts} id="flow-prompts">
      <h2>Die fehlenden Szenen vorbereiten.</h2>
      <p>Zuerst B1, danach C1. B2 ist optional. In Flow Video wählen und die genannte Referenz verwenden. Verfügbare Modi und Längen hängen von Modell, Konto und Region ab. Ziel sind sechs nutzbare Sekunden pro neuem Clip; bei einer anderen angebotenen Länge anschließend passend schneiden.</p>
      {storyboard.prompts.map(prompt => <details key={prompt.id} id={`prompt-${prompt.id}`} className={styles.prompt} open={prompt.id === "B1"}>
        <summary>{prompt.id}: {prompt.title} · {prompt.priority}</summary>
        <p><strong>Referenz:</strong> {prompt.reference}<br /><strong>Modus:</strong> {prompt.mode}<br /><strong>Montageziel:</strong> {prompt.length}</p>
        <pre>{prompt.prompt}</pre>
        <p><strong>Vor Freigabe prüfen:</strong> {prompt.qc}</p>
        <p><strong>Übergang:</strong> {prompt.transition}</p>
      </details>)}
      <h3>Produktionsreihenfolge</h3>
      <p>B1 und C1 jeweils einzeln erzeugen und prüfen. Gesichter, Hände, Geräte, Logos und konstantes Licht kontrollieren. Den freigegebenen Clip zunächst als komprimiertes Video testen und erst danach in die notwendige Bildfolge umwandeln. Neue Kapitel laden erst kurz vor ihrem Einsatz. Mobil bleiben Poster und freiwillige Wiedergabe der Standard.</p>
      <p>Für die empfohlene Fassung stehen 22 Sekunden Ausgangsmaterial im Plan: A mit zehn Sekunden sowie B1 und C1 mit je sechs Sekunden. Das ist keine feste Betrachtungszeit; die Scrollgeschwindigkeit bestimmt der Besucher.</p>
      <p>Die Standortangaben werden sachlich gezeigt. Der inszenierte Loft-Eingang ist keine Darstellung der tatsächlichen Anfahrt. Aktuelle Kurszeiten, Belegungen und echte Buchungsbestätigungen werden nicht durch den Film behauptet.</p>
      <p>Flow-Funktionen: {storyboard.sources.map((source, i) => <span key={source.url}>{i ? " · " : ""}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></span>)}</p>
      <Link href="/">Zur aktuellen Startseite</Link>
    </section>
  </div>;
}
