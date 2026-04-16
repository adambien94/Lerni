import { Loader2, NotebookIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CreateNotebookModal } from "@/components/notebook/CreateNotebookModal";
import { Button } from "@/components/ui/button";
import { SourcesSection } from "@/components/notebook/SourcesSection";
import { StudioSection } from "@/components/notebook/StudioSection";
import { SummarySection } from "@/components/notebook/SummarySection";
import { useLayoutStore } from "@/stores/layoutStore";

const NOTEBOOK_FAKE_LOAD_MS = 900;

export default function Notebook() {
  const { id } = useParams<{ id: string }>();
  const [isNotebookReady, setIsNotebookReady] = useState(false);
  const isCreateNotebookModalOpen = useLayoutStore(
    (state) => state.isCreateNotebookModalOpen,
  );
  const closeCreateNotebookModal = useLayoutStore(
    (state) => state.closeCreateNotebookModal,
  );
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const [studioCollapsed, setStudioCollapsed] = useState(false);

  useEffect(() => {
    setIsNotebookReady(false);
    const timeoutId = window.setTimeout(() => {
      setIsNotebookReady(true);
    }, NOTEBOOK_FAKE_LOAD_MS);
    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const desktopGridClass = sourcesCollapsed
    ? studioCollapsed
      ? "xl:grid-cols-[72px_minmax(0,1fr)_72px]"
      : "xl:grid-cols-[72px_minmax(0,1fr)_320px]"
    : studioCollapsed
      ? "xl:grid-cols-[320px_minmax(0,1fr)_72px]"
      : "xl:grid-cols-[320px_minmax(0,1fr)_320px]";

  if (!isNotebookReady) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Ładowanie notatnika"
      >
        <div className="text-center space-y-2">
          <Loader2 className="h-10 w-10 animate-spin text-foreground mx-auto" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      key={id}
      className="mx-auto flex min-h-screen w-full max-w-[1980px] flex-col px-4 py-4"
    >
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
      <CreateNotebookModal
        isOpen={isCreateNotebookModalOpen}
        onClose={closeCreateNotebookModal}
      />
    </main>
  );
}
