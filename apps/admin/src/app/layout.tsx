import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preferred.AI Publisher",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
