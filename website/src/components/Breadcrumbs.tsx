"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/training": "Training",
  "/about": "Über uns",
  "/coaches": "Coaches",
  "/pricing": "Preise",
  "/shop": "Shop",
  "/contact": "Kontakt",
  "/schedule": "Kursplan",
  "/trial": "Probetraining",
  "/membership": "Mitgliedschaft",
  "/dashboard": "Dashboard",
  "/login": "Anmelden",
  "/blog": "Blog",
  "/agb": "AGB",
  "/datenschutz": "Datenschutz",
  "/impressum": "Impressum",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  // Build breadcrumb items
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  // Build path progressively
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white/80 backdrop-blur-sm border-b border-muted py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm font-body">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={crumb.href} className="flex items-center">
                {index === 0 ? (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-primary-700 transition-colors flex items-center"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                    {isLast ? (
                      <span className="text-foreground font-semibold" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-muted-foreground hover:text-primary-700 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

