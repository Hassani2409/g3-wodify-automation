"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pricing } from "@/lib/pricing";
import styles from "./PricingCalculator.module.css";

const sessions = [2, 3, 7]; // dots per week; Unlimited fills the whole week

export default function PricingCalculator() {
  const [student, setStudent] = useState(false);
  const [term, setTerm] = useState<12 | 6>(12);

  return (
    <div className={styles.calculator}>
      <div className={styles.controls}>
        <Toggle label="Tarif" value={student ? "student" : "regular"} onChange={(v) => setStudent(v === "student")}
          options={[{ value: "regular", label: "Regulär" }, { value: "student", label: "Studierende" }]} />
        <Toggle label="Laufzeit" value={String(term)} onChange={(v) => setTerm(v === "6" ? 6 : 12)}
          options={[{ value: "12", label: "12 Monate" }, { value: "6", label: "6 Monate" }]} />
      </div>

      <ul className={styles.plans}>
        {pricing.rates.map((rate, index) => {
          const price = (student ? rate.student : rate.regular) + (term === 6 ? pricing.sixMonthSurcharge : 0);
          const days = sessions[index];
          return (
            <li key={rate.name} className={styles.plan} data-featured={index === 1 || undefined}>
              <h3>{rate.name}</h3>
              <div className={styles.week}>
                {Array.from({ length: 7 }, (_, d) => (
                  <span key={d} data-on={d < days || undefined} aria-hidden="true" />
                ))}
                <span className={styles.weekLabel}>{days === 7 ? "so oft du willst" : `${days} Trainings pro Woche`}</span>
              </div>
              <p className={styles.price}>
                <span className={styles.amount} aria-live="polite">{price} €</span>
                <span className={styles.per}>pro Monat</span>
              </p>
            </li>
          );
        })}
      </ul>

      <div className={styles.extras}>
        <p>Drop-in <strong>{pricing.dropIn} €</strong> pro Besuch</p>
        <p>Personal Training <strong>{pricing.personalTrainingHour} €</strong> pro Stunde</p>
        <p>Probetraining <strong>kostenlos</strong></p>
      </div>

      <div className={styles.footer}>
        <Button asChild className={styles.cta}>
          <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowUpRight aria-hidden="true" /></Link>
        </Button>
        <p>
          Veröffentlichte Preise, abgerufen am {pricing.retrievedOn}. Die aktuellen Konditionen bestätigt dir das Team
          vor Vertragsabschluss. <a href={pricing.sourceUrl}>Originalseite ansehen</a>
        </p>
      </div>
    </div>
  );
}

function Toggle({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void;
}) {
  return (
    <div className={styles.toggle} role="group" aria-label={label}>
      <span className={styles.toggleLabel}>{label}</span>
      <div>
        {options.map((option) => (
          <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
