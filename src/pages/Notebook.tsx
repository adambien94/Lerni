import { Loader2, NotebookIcon } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
  const [readyForNotebookId, setReadyForNotebookId] = useState<string | null>(
    null,
  );
  const isCreateNotebookModalOpen = useLayoutStore(
    (state) => state.isCreateNotebookModalOpen,
  );
  const closeCreateNotebookModal = useLayoutStore(
    (state) => state.closeCreateNotebookModal,
  );
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const [studioCollapsed, setStudioCollapsed] = useState(false);
  const [isStudioFlashcardsOpen, setIsStudioFlashcardsOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setReadyForNotebookId(id);
    }, NOTEBOOK_FAKE_LOAD_MS);
    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const isNotebookReady = Boolean(id) && readyForNotebookId === id;

  const desktopGridVars = useMemo(() => {
    const sourcesW = sourcesCollapsed ? "58px" : "320px";
    const studioW = studioCollapsed
      ? "58px"
      : isStudioFlashcardsOpen
        ? "720px"
        : "320px";
    return {
      "--sourcesW": sourcesW,
      "--studioW": studioW,
    } as CSSProperties;
  }, [isStudioFlashcardsOpen, sourcesCollapsed, studioCollapsed]);

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
          <Loader2 className="h-14 w-14 animate-spin text-foreground mx-auto" />
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
            <Button variant="ghost">← Wróć do listy notatników</Button>
        </Link>
      </div>

      <section
        style={desktopGridVars}
        className="grid flex-1 grid-cols-1 gap-4 transition-[grid-template-columns] duration-300 ease-out xl:will-change-[grid-template-columns] xl:grid-cols-[var(--sourcesW)_minmax(0,1fr)_var(--studioW)]"
      >
        <SourcesSection
          collapsed={sourcesCollapsed}
          onToggleCollapse={() => setSourcesCollapsed((current) => !current)}
        />
        <SummarySection />
        <StudioSection
          collapsed={studioCollapsed}
          onToggleCollapse={() => setStudioCollapsed((current) => !current)}
          onFlashcardsOpenChange={setIsStudioFlashcardsOpen}
        />
      </section>
      <CreateNotebookModal
        isOpen={isCreateNotebookModalOpen}
        onClose={closeCreateNotebookModal}
      />
    </main>
  );
}
