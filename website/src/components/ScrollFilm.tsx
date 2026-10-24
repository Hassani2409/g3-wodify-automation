"use client";
import Image from "next/image";
import Link from "next/link";
import { useScrollSequence } from "./useScrollSequence";
import styles from "./ScrollFilm.module.css";
const COUNT = 240;
const BASE = "/sequences/g3-owner-tour";

export default function ScrollFilm() {
  const { sequenceRef, stickyRef, canvasRef, rangeRef, outputRef, ready, failed,
    reducedMotion, enabled, toggle, seekRef } = useScrollSequence();
  return <div className={styles.page}>
    <header className={styles.intro}>
      <h1>Ein Schritt in die Box.</h1>
      <p>Scrolle langsam weiter: Du steuerst die Kamerafahrt durch deine Scrollbewegung. Zurückscrollen spielt die Bildfolge rückwärts ab.</p>
      <a href="#after-scroll-film">Sequenz überspringen</a>
    </header>
    <section ref={sequenceRef} className={styles.sequence} aria-label="Scroll-gesteuerter Film-Prototyp">
      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.frame}>
          <Image src={`${BASE}/0000.webp`} alt="KI-inszenierter Inhaber am Eingang einer Trainingsbox" fill priority sizes="100vw" className={styles.poster} />
          <canvas ref={canvasRef} className={styles.canvas} style={{ opacity: ready ? 1 : 0 }} aria-hidden="true" />
        </div>
        <div className={styles.controls}>
          <button type="button" disabled={reducedMotion} onClick={toggle} aria-pressed={!enabled}>{enabled ? "Scroll-Bewegung anhalten" : "Scroll-Bewegung fortsetzen"}</button>
          <label>Filmposition <input ref={rangeRef} type="range" disabled={reducedMotion} min={0} max={COUNT - 1} defaultValue={0} onChange={event => seekRef.current(Number(event.target.value))} /></label>
          <output ref={outputRef} aria-live="off">1 / {COUNT}</output>
        </div>
        <p className={styles.caption}>{failed ? "Einzelbilder konnten nicht geladen werden. Das Standbild bleibt verfügbar. " : ""}240 Einzelbilder · 10 Sekunden Ausgangsmaterial · KI-inszenierte Szene mit dem Inhaber, Raum als Gestaltungskonzept. Bei reduzierter Bewegung bleibt das Standbild stehen.</p>
      </div>
    </section>
    <section id="after-scroll-film" className={styles.outro}>
      <h2>So fühlt sich der Einstieg an.</h2>
      <p>Das ist ein separater Technik-Prototyp. Er zeigt die Einzelbild-Steuerung ohne die Textebene des Startseiten-Heros.</p>
      <Link href="/">Zur G3-Startseite</Link>
    </section>
  </div>;
}
