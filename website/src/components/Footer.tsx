"use client";

import { site } from "@/lib/site";

import Link from "next/link";
import { Dumbbell, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

const navigation = {
  training: [
    { name: "CrossFit Foundations", href: "/training#crossfit-beginner" },
    { name: "CrossFit Classes", href: "/training#crossfit-advanced" },
    { name: "Olympic Weightlifting", href: "/training#olympic-lifting" },
    { name: "Strength & Conditioning", href: "/training#strength-conditioning" },
  ],
  company: [
    { name: "Über uns", href: "/about" },
    { name: "Coaches", href: "/coaches" },
    { name: "Preise", href: "/pricing" },
    { name: "Kontakt", href: "/contact" },
  ],
  legal: [
    { name: "Impressum", href: "/impressum" },
    { name: "Datenschutz", href: "/datenschutz" },
    { name: "AGB", href: "/agb" },
  ],
  social: [
    { name: "Instagram", href: "https://instagram.com/g3crossfit", icon: Instagram },
    { name: "Facebook", href: "https://facebook.com/g3crossfit", icon: Facebook },
    { name: "YouTube", href: "https://youtube.com/@g3crossfit", icon: Youtube },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-primary-500 rounded-lg">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-heading">
                  G3 CrossFit
                </span>
                <span className="text-xs font-medium text-primary-300 font-body">
                  Berlin
                </span>
              </div>
            </Link>
            <p className="text-primary-200 leading-relaxed font-body">
              Deine CrossFit Box am Gleisdreieck. Persönliches Training für alle Fitnesslevel in einer familiären Atmosphäre.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary-800 hover:bg-primary-700 rounded-lg transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200 ease-out hover:scale-110"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Training Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-heading">
              Training
            </h3>
            <ul className="space-y-3">
              {navigation.training.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-white transition-colors duration-300 font-body"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-heading">
              Unternehmen
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-white transition-colors duration-300 font-body"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-heading">
              Kontakt
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-start gap-3 text-primary-200 hover:text-white transition-colors duration-300 group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-primary-500 group-hover:text-white transition-colors" />
                  <span className="font-body">{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3 text-primary-200 hover:text-white transition-colors duration-300 group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-primary-500 group-hover:text-white transition-colors" />
                  <span className="font-body">{site.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-200">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary-500" />
                  <span className="font-body">{site.street}<br />{site.postalCode} {site.city}</span>
                </div>
              </li>
            </ul>

            <p className="mt-6 text-primary-200 font-body">{site.entrance}</p>
            <Link href="/schedule" className="inline-block mt-3 underline underline-offset-4">Aktuelle Kurszeiten</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-primary-300 text-sm font-body">
              © {new Date().getFullYear()} G3 CrossFit Berlin. Alle Rechte vorbehalten.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-300 hover:text-white text-sm transition-colors duration-300 font-body"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

