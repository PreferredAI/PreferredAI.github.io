import Link from "next/link";
import Navigation from "@/components/Navigation";
import TeamPhotos from "@/components/TeamPhotos";
import { getAllCategories } from "@/lib/markdown-posts";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getAllCategories();

  return (
    <div className="tech-grid min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-lg focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      {/* Floating Frosted Pill Navbar */}
      <Navigation />

      {/* Global Page Skeleton Wrapper */}
      <div className="flex flex-1 flex-col pt-28">
        <div className="container flex-1 max-w-[1360px]">
          <div className="flex flex-col gap-10 py-6 lg:flex-row">
            {/* Main Column */}
            <main
              id="main"
              className="flex-1 min-w-0 motion-safe:animate-fade-in"
            >
              {children}
            </main>

            {/* Sidebar Section */}
            <aside className="w-full lg:w-[320px] shrink-0">
              <div className="sticky top-28 space-y-5">
                {/* Team Card Carousel Container */}
                <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80 select-none">
                    The Team
                  </h3>
                  <TeamPhotos />
                </div>

                {/* Categories Card Container */}
                <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80 select-none">
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="group flex items-center px-2.5 py-1.5 text-xs font-medium text-muted-foreground rounded-lg hover:text-primary hover:bg-primary/5 transition-colors select-none"
                        >
                          <span className="mr-2 text-muted-foreground/40 group-hover:text-primary transition-colors">
                            ▸
                          </span>
                          <span>{category.name}</span>
                          <span className="ml-auto px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 text-muted-foreground/80 rounded border border-border/40 transition-colors">
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
      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-xs py-8 mt-16 select-none">
        <div className="container max-w-[1360px] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-medium">
            Preferred.AI &copy; {new Date().getFullYear()} &middot; Singapore
            Management University
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="https://github.com/PreferredAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://cornac.preferred.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Cornac
            </a>
            <Link
              href="/feed.xml"
              className="hover:text-foreground transition-colors"
            >
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
