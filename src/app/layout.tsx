import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import TeamPhotos from "@/components/TeamPhotos";
import { getAllCategories } from "@/lib/markdown-posts";

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
  const categories = getAllCategories();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="tech-grid min-h-screen flex flex-col bg-background selection:bg-red-150 selection:text-[#b91c1c]">
        {/* Floating Frosted Pill Navbar */}
        <Navigation />

        {/* Global Page Skeleton Wrapper */}
        <div className="flex flex-1 flex-col pt-28">
          <div className="container flex-1 max-w-[1360px]">
            <div className="flex flex-col gap-10 py-6 lg:flex-row">
              
              {/* Main Column */}
              <main className="flex-1 min-w-0 page-fade-in animate-fade-in-up">
                {children}
              </main>

              {/* Sidebar Section */}
              <aside className="w-full lg:w-[360px] shrink-0">
                <div className="sticky top-28 space-y-6">
                  
                  {/* Team Card Carousel Container */}
                  <div className="bg-card/80 border border-border/60 rounded-2xl p-5 shadow-sm shadow-black/[0.01]">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400 select-none">
                      The Team
                    </h3>
                    <TeamPhotos />
                  </div>

                  {/* Categories Card Container */}
                  <div className="bg-card/80 border border-border/60 rounded-2xl p-5 shadow-sm shadow-black/[0.01]">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
                      Categories
                    </h3>
                    <ul className="space-y-1.5">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/category/${category.slug}`}
                            className="flex items-center px-2.5 py-1.5 text-xs font-semibold text-muted-foreground rounded-xl hover:text-primary hover:bg-primary/8 border border-transparent hover:border-primary/10 transition-all select-none"
                          >
                            <span className="mr-2 text-gray-300">▸</span>
                            {category.name}
                            <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground rounded-full border border-border/20">
                              {category.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </aside>

            </div>
          </div>
        </div>

        {/* Global Sleek Footer */}
        <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-8 mt-12 select-none">
          <div className="container max-w-7xl text-center">
            <p className="text-xs font-semibold text-gray-500">
              Preferred.AI © {new Date().getFullYear()}. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
