import { ReactNode } from "react";
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

