import type { Metadata } from "next";
import { Barlow_Condensed, Open_Sans, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import FloatingPhoneButton from "@/components/FloatingPhoneButton";
import FloatingChatButton from "@/components/FloatingChatButton";
import { AuthProvider } from "@/contexts/AuthContext";

// G3 CrossFit Fonts
const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-button",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// G3 CrossFit Brand Font (Agency - optional)
// Note: Agency fonts are loaded via CSS @font-face in globals.css
// to avoid Turbopack compatibility issues with localFont
const agencyBold = {
  variable: "--font-agency-bold",
};

const agencyRegular = {
  variable: "--font-agency-regular",
};

export const metadata: Metadata = {
  title: {
    default: "G3 CrossFit Berlin | Premium CrossFit Training",
    template: "%s | G3 CrossFit Berlin",
  },
  description: "Dein CrossFit Gym im Herzen Berlins. Familiäre Atmosphäre, zertifizierte Coaches, alle Fitnesslevel. Kostenloses Probetraining buchen!",
  keywords: [
    "CrossFit",
    "Berlin",
    "Fitness",
    "Training",
    "Gym",
    "G3 CrossFit",
    "CrossFit Berlin",
    "Fitness Studio Berlin",
    "Krafttraining",
    "Functional Fitness",
    "Olympic Weightlifting",
    "Probetraining",
    "Mitgliedschaft",
  ],
  authors: [{ name: "G3 CrossFit Berlin" }],
  creator: "G3 CrossFit Berlin",
  publisher: "G3 CrossFit Berlin",
  metadataBase: new URL("https://www.g3crossfit.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "G3 CrossFit Berlin | Premium CrossFit Training",
    description: "Dein CrossFit Gym im Herzen Berlins. Familiäre Atmosphäre, zertifizierte Coaches, alle Fitnesslevel.",
    type: "website",
    locale: "de_DE",
    siteName: "G3 CrossFit Berlin",
    url: "https://www.g3crossfit.de",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "G3 CrossFit Berlin Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "G3 CrossFit Berlin | Premium CrossFit Training",
    description: "Dein CrossFit Gym im Herzen Berlins.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "Fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${barlowCondensed.variable} ${openSans.variable} ${montserrat.variable} ${agencyBold.variable} ${agencyRegular.variable} antialiased`}
      >
        <StructuredData />
        <AuthProvider>
          <Header />
          <Breadcrumbs />
          <main>{children}</main>
          <Footer />
          <FloatingPhoneButton />
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}
