import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { AuthProvider } from "@/contexts/AuthContext";

export default function ShowcaseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

