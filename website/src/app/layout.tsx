import { site } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Open_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import ContactButton from "@/components/ContactButton";
import MotionProvider from "@/components/MotionProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// G3 CrossFit Fonts
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

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
  metadataBase: new URL(site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "G3 CrossFit Berlin | Premium CrossFit Training",
    description: "Dein CrossFit Gym im Herzen Berlins. Familiäre Atmosphäre, zertifizierte Coaches, alle Fitnesslevel.",
    type: "website",
    locale: "de_DE",
    siteName: "G3 CrossFit Berlin",
    url: site.url,
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
        className={`${barlowCondensed.variable} ${openSans.variable} antialiased`}
      >
        <StructuredData />
        <AuthProvider>
          <MotionProvider>
          <SiteHeader />
          <Breadcrumbs />
          <main>{children}</main>
          <Footer />
          <ContactButton />
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
