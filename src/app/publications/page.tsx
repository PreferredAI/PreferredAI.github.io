import { Metadata } from "next";
import { PUBLICATIONS_DATA } from "@/data/publications";
import PublicationsExplorer from "@/components/PublicationsExplorer";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research papers and publications from Preferred.AI",
};

export default function PublicationsPage() {
  return (
    <div className="bg-card/85 border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm shadow-black/[0.01]">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-8 border-b border-border/60 pb-3 select-none">
        Read Our Papers
      </h2>
      
      {/* Interactive searchable dashboard */}
      <PublicationsExplorer data={PUBLICATIONS_DATA} />
    </div>
  );
}
