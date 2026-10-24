// Verified against https://g3crossfit.com and /kontakt/ on 2026-10-24.
// Homepage says eight participants; training subpage says nine. Use the supplied homepage policy until confirmed.
export const site = {
  name: "G3 CrossFit",
  url: "https://g3crossfit.com",
  email: "info@g3crossfit.com",
  phone: "0160 55 718 66",
  phoneHref: "tel:+491605571866",
  street: "Tempelhofer Ufer 36",
  postalCode: "10963",
  city: "Berlin",
  entrance: "2. Hinterhaus, 1. Etage",
  maxParticipants: 8,
  // No geo coordinates until the exact entrance has been verified.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tempelhofer+Ufer+36%2C+10963+Berlin",
  podcastUrl: "https://anchor.fm/open-gym-podcast/episodes/30-Minuten-Hard-Cut-e1ajvde/a-a6uo96h",
  scheduleUrl: "/schedule",
} as const;

export const assistantFacts = `
Standort: ${site.street}, ${site.postalCode} ${site.city}, ${site.entrance}.
Kontakt: ${site.phone}, ${site.email}.
Lage: am Gleisdreieck, nahe Potsdamer Platz.
Öffnungszeiten und aktuelle Preise sind nicht bestätigt. Keine Uhrzeiten oder Preise erfinden; an ${site.email} oder die Wodify-App verweisen.
Kostenloses Probetraining auf /contact#booking anfragen. Keine sofortige Buchungsbestätigung versprechen.
Keine kostenlosen Parkplätze versprechen.
Kleine Kurse mit maximal ${site.maxParticipants} Personen. Bei nur einer Anmeldung findet das Training als Personal Training ohne Aufpreis statt.
Angebote: CrossFit, ONRAMP, Yoga, Weightlifting, Functional Bodybuilding, Endurance, Gymnastics, Open Gym und Team-WODs.
`;

export const trainingPrograms = [
  { id: "crossfit-beginner", title: "ONRAMP", description: "Grundbewegungen kennenlernen und sicher ins CrossFit einsteigen." },
  { id: "crossfit-advanced", title: "CrossFit WOD", description: "Wechselnde Workouts aus Kraft, Ausdauer und funktionellen Bewegungen." },
  { id: "olympic-lifting", title: "Weightlifting", description: "Technik für die Langhantel und das olympische Gewichtheben." },
  { id: "strength-conditioning", title: "Functional Bodybuilding", description: "Gezieltes Krafttraining für den gesamten Körper." },
  { id: "yoga", title: "Yoga", description: "Bewegung und bewusste Entspannung als Ergänzung zum Training." },
  { id: "team-wods", title: "Team-WODs", description: "Gemeinsame Workouts mit deinem Team." },
  { id: "endurance", title: "Endurance", description: "Längere Workouts für deine Ausdauer." },
  { id: "gymnastics", title: "Gymnastics", description: "Turnerische Elemente und Körperbeherrschung üben." },
  { id: "personal-training", title: "Personal Training", description: "Persönliches Coaching nach Vereinbarung." },
  { id: "open-gym", title: "Open Gym", description: "Eigenständig an deinen Trainingszielen arbeiten." },
];

export const coaches = [
  { name: "Felix Läufle", role: "Headcoach, Inhaber und Athlet" },
  { name: "Zeno Behm", role: "Functional & Athletic Coach" },
  { name: "Steffen Mulsow", role: "CrossFit Trainer" },
  { name: "Markus Gilles", role: "CrossFit Trainer & Athlet" },
  { name: "Natalia Timm", role: "Trainerin" },
];
