// Published on https://g3crossfit.com/mitgliedschaft/, retrieved 2026-10-24.
// Must be re-confirmed by G3 before a contract; never present as binding.
export const pricing = {
  retrievedOn: "24. Oktober 2026",
  sourceUrl: "https://g3crossfit.com/mitgliedschaft/",
  rates: [
    { name: "2× pro Woche", regular: 100, student: 90 },
    { name: "3× pro Woche", regular: 120, student: 105 },
    { name: "Unlimited", regular: 140, student: 120 },
  ],
  sixMonthSurcharge: 10,
  dropIn: 24,
  personalTrainingHour: 119,
} as const;
