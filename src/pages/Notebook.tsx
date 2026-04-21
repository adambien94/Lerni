import { NotebookIcon } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { NotebookTitleModal } from "@/components/notebook/NotebookTitleModal";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  addNotebookSource,
  deleteNotebookSource,
  getNotebookById,
  listNotebookSources,
  renameNotebook,
  renameNotebookSource,
  updateNotebookSourceSelection,
} from "@/lib/notebooks";
import { SourcesSection } from "@/components/notebook/SourcesSection";
import { StudioSection } from "@/components/notebook/StudioSection";
import { SummarySection } from "@/components/notebook/SummarySection";
import type { NotebookSourceDto } from "@/types/notebook";

const NOTEBOOK_FAKE_LOAD_MS = 900;

export default function Notebook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [readyForNotebookId, setReadyForNotebookId] = useState<string | null>(
    null,
  );
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const [studioCollapsed, setStudioCollapsed] = useState(false);
  const [isStudioExpanded, setIsStudioExpanded] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState("Notebook");
  const [isRenameNotebookModalOpen, setIsRenameNotebookModalOpen] =
    useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [sources, setSources] = useState<NotebookSourceDto[]>([]);

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
  const notebookId = id && id !== "new" ? id : null;

  useEffect(() => {
    if (!notebookId) return;

    let cancelled = false;
    const loadNotebook = async () => {
      const [notebook, notebookSources] = await Promise.all([
        getNotebookById(notebookId),
        listNotebookSources(notebookId),
      ]);
      if (cancelled) return;
      setNotebookTitle(notebook?.title ?? "Notebook");
      setSources(notebookSources);
    };

    void loadNotebook();
    return () => {
      cancelled = true;
    };
  }, [notebookId]);

  useEffect(() => {
    if (!notebookId) return;
    if (!location.state || typeof location.state !== "object") return;
    if (!("openRenameTitleModal" in location.state)) return;
    if (location.state.openRenameTitleModal !== true) return;

    setIsRenameNotebookModalOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, notebookId]);

  const effectiveSources = notebookId ? sources : [];
  const checkedSourcesCount = effectiveSources.filter(
    (source) => source.checked,
  ).length;
  const effectiveNotebookTitle = notebookId ? notebookTitle : "Untitled notebook";

  const handleAddSource = async () => {
    if (!notebookId) return;
    const trimmed = sourceUrl.trim();
    if (!trimmed) return;

    try {
      const created = await addNotebookSource(notebookId, trimmed);
      setSources((current) => [created, ...current]);
      setSourceUrl("");
      toast.success("Zrodlo zostalo dodane.");
    } catch {
      toast.error("Nie udalo sie dodac zrodla. Sprobuj ponownie.");
    }
  };

  const handleToggleSource = async (sourceId: string) => {
    const previous = sources;
    const next = previous.map((source) =>
      source.id === sourceId ? { ...source, checked: !source.checked } : source,
    );
    setSources(next);
    const changed = next.find((source) => source.id === sourceId);
    if (!changed) return;
    try {
      await updateNotebookSourceSelection(sourceId, changed.checked);
    } catch {
      setSources(previous);
      toast.error("Nie udalo sie zmienic statusu zrodla. Sprobuj ponownie.");
    }
  };

  const handleRemoveSource = async (sourceId: string) => {
    const previous = sources;
    setSources((current) => current.filter((source) => source.id !== sourceId));
    try {
      await deleteNotebookSource(sourceId);
      toast.success("Zrodlo zostalo usuniete.");
    } catch {
      setSources(previous);
      toast.error("Nie udalo sie usunac zrodla. Sprobuj ponownie.");
    }
  };

  const handleRenameSource = async (sourceId: string, title: string) => {
    const previous = sources;
    setSources((current) =>
      current.map((source) =>
        source.id === sourceId ? { ...source, customTitle: title.trim() } : source,
      ),
    );
    try {
      await renameNotebookSource(sourceId, title);
      toast.success("Nazwa zrodla zostala zaktualizowana.");
    } catch {
      setSources(previous);
      toast.error("Nie udalo sie zmienic nazwy zrodla. Sprobuj ponownie.");
    }
  };

  const handleRenameNotebook = async (title: string) => {
    if (!notebookId) return;
    await renameNotebook(notebookId, title);
    setNotebookTitle(title.trim());
    toast.success("Tytul notatnika zostal zaktualizowany.");
  };

  const desktopGridVars = useMemo(() => {
    const sourcesW = sourcesCollapsed ? "58px" : "320px";
    const studioW = studioCollapsed
      ? "58px"
      : isStudioExpanded
        ? "690px"
        : "320px";
    return {
      "--sourcesW": sourcesW,
      "--studioW": studioW,
    } as CSSProperties;
  }, [isStudioExpanded, sourcesCollapsed, studioCollapsed]);

  if (!isNotebookReady) {
    return <LoadingOverlay loadingMessage="Loading..." />;
  }

  return (
    <main
      key={id}
      className="flex h-screen min-h-0 w-full flex-col overflow-hidden px-4 py-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          {/* <div className="inline-flex rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Notatnik #{id}
          </div> */}
          <h1 className="text-xl font-base flex gap-4 items-center text-foreground">
            <NotebookIcon className="h-8 w-8" />
            {effectiveNotebookTitle}
          </h1>
        </div>
        <Link to="/">
          <Button variant="ghost">← Wróć do listy notatników</Button>
        </Link>
      </div>
      <section
        style={desktopGridVars}
        className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden transition-[grid-template-columns] duration-300 ease-out xl:will-change-[grid-template-columns] xl:grid-cols-[var(--sourcesW)_minmax(0,1fr)_var(--studioW)]"
      >
        <SourcesSection
          collapsed={sourcesCollapsed}
          onToggleCollapse={() => setSourcesCollapsed((current) => !current)}
          sourceUrl={sourceUrl}
          onSourceUrlChange={setSourceUrl}
          onAddSource={handleAddSource}
          sources={effectiveSources}
          onToggleSource={handleToggleSource}
          onRemoveSource={handleRemoveSource}
          onRenameSource={handleRenameSource}
        />
        <SummarySection checkedSourcesCount={checkedSourcesCount} />
        <StudioSection
          collapsed={studioCollapsed}
          onToggleCollapse={() => setStudioCollapsed((current) => !current)}
          onStudioExpandedChange={setIsStudioExpanded}
        />
      </section>
      <NotebookTitleModal
        open={isRenameNotebookModalOpen}
        onOpenChange={setIsRenameNotebookModalOpen}
        onSubmitTitle={handleRenameNotebook}
        initialTitle={effectiveNotebookTitle}
        dialogTitle="Nadaj nazwę notatnikowi"
        dialogDescription="Notatnik został utworzony. Ustaw własny tytuł teraz lub później."
        submitLabel="Zapisz tytuł"
      />
    </main>
  );
}
