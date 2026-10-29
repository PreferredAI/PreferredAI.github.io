import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <div className="py-6">
            <main id="main" className="min-w-0 motion-safe:animate-fade-in">
              {children}
            </main>
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
