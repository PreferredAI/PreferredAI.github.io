import type { Metadata } from "next";
import PublicationsExplorer from "@/components/PublicationsExplorer";
import { PUBLICATIONS_DATA } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research papers and publications from Preferred.AI",
};

export default function PublicationsPage() {
  const totalPapers = PUBLICATIONS_DATA.reduce(
    (total, section) => total + section.publications.length,
    0,
  );

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-8 shadow-xs">
      <div className="mb-6 pb-4 border-b border-border/60 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Publications
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Peer-reviewed papers, tutorials, and conference proceedings
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0">
          {totalPapers} papers
        </span>
      </div>

      {/* Interactive searchable dashboard */}
      <PublicationsExplorer data={PUBLICATIONS_DATA} />
    </div>
  );
}
