import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Publisher",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  // Keystatic currently hard-codes /keystatic for its internal navigation and
  // OAuth callbacks, so /admin is intentionally a friendly entry-point alias.
  redirect("/keystatic");
}
