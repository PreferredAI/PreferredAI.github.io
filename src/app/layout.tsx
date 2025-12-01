import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import TeamPhotos from "@/components/TeamPhotos";

export const metadata: Metadata = {
  title: "Preferred.AI",
  description: "Preferences and Recommendations from Data & AI",
  icons: {
    icon: "/favi.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex items-center justify-between py-6">
                <Link href="/" className="inline-block">
                  <div className="flex flex-col items-center">
                    <img
                      src="/Brand.png"
                      alt="Preferred.AI"
                      className="h-20 w-auto"
                    />
                    <p className="mt-1 text-s italic text-gray-600">
                      Preferences and Recommendations from Data & AI
                    </p>
                  </div>
                </Link>
                <Navigation />
              </div>
            </div>
          </header>

          {/* Main Content with Sidebar */}
          <div className="flex flex-1 bg-white">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex flex-col gap-8 py-8 lg:flex-row">
                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Sidebar */}
                <aside className="w-full lg:w-80">
                  <div className="sticky top-8 space-y-8">
                    {/* Team Section */}
                    <div>
                      <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-gray-800">
                        Team
                      </h3>
                      <TeamPhotos />
                    </div>

                    {/* Categories Section */}
                    <div>
                      <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-gray-800">
                        Categories
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/category/announcement"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Announcement
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/defense"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Defense
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/education"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Education
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/presentation"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Presentation
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/publication"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Publication
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/social"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Social
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/travel"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Travel
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/video"
                            className="flex items-center text-gray-700 hover:text-[#b91c1c]"
                          >
                            <span className="mr-2 text-gray-400">▸</span>
                            Video
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6">
            <div className="container mx-auto max-w-7xl px-4">
              <p className="text-center text-sm text-gray-600">
                Preferred.AI © {new Date().getFullYear()}. All Rights Reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
