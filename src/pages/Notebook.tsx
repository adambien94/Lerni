import { NotebookIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SourcesSection } from "@/components/notebook/SourcesSection";
import { StudioSection } from "@/components/notebook/StudioSection";
import { SummarySection } from "@/components/notebook/SummarySection";

export default function Notebook() {
  const { id } = useParams<{ id: string }>();
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const [studioCollapsed, setStudioCollapsed] = useState(false);

  const desktopGridClass = sourcesCollapsed
    ? studioCollapsed
      ? "xl:grid-cols-[72px_minmax(0,1fr)_72px]"
      : "xl:grid-cols-[72px_minmax(0,1fr)_320px]"
    : studioCollapsed
      ? "xl:grid-cols-[320px_minmax(0,1fr)_72px]"
      : "xl:grid-cols-[320px_minmax(0,1fr)_320px]";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1980px] flex-col px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          {/* <div className="inline-flex rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Notatnik #{id}
          </div> */}
          <h1 className="text-2xl font-base tracking-tight flex gap-4">
            <NotebookIcon className="h-8 w-8" />
            52 Essential JavaScript Frontend Interview Questions
          </h1>
        </div>
        <Link to="/">
          <Button variant="ghost" className="text-sm">
            ← Wróć do listy notatników
          </Button>
        </Link>
      </div>

      <section className={`grid flex-1 grid-cols-1 gap-4 ${desktopGridClass}`}>
        <SourcesSection
          collapsed={sourcesCollapsed}
          onToggleCollapse={() => setSourcesCollapsed((current) => !current)}
        />
        <SummarySection />
        <StudioSection
          collapsed={studioCollapsed}
          onToggleCollapse={() => setStudioCollapsed((current) => !current)}
        />
      </section>
    </main>
  );
}
