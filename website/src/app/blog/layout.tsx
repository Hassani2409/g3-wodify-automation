import type { Metadata } from "next";
import type { ReactNode } from "react";

// Sample content only: keep out of search engines until real, approved articles exist.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
