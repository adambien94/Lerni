import {
  PanelLeft,
  FileText,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  buildFaviconUrl,
  fallbackTitleFromUrl,
  fetchSourceTitle,
} from "@/lib/source-metadata";
import { RenameSourceDialog } from "@/components/notebook/RenameSourceDialog";
import type { NotebookSourceDto } from "@/types/notebook";

type SourcesSectionProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  sourceUrl: string;
  onSourceUrlChange: (value: string) => void;
  onAddSource: () => void;
  sources: NotebookSourceDto[];
  onToggleSource: (id: string) => void;
  onRemoveSource: (id: string) => void;
  onRenameSource: (id: string, title: string) => void;
};

export function SourcesSection({
  collapsed,
  onToggleCollapse,
  sourceUrl,
  onSourceUrlChange,
  onAddSource,
  sources,
  onToggleSource,
  onRemoveSource,
  onRenameSource,
}: SourcesSectionProps) {
  const [sourceTitles, setSourceTitles] = useState<Record<string, string>>({});
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamedSourceId, setRenamedSourceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletedSourceId, setDeletedSourceId] = useState<string | null>(null);

  const handleRenameDialogOpenChange = (open: boolean) => {
    setRenameDialogOpen(open);
    if (!open) {
      setRenamedSourceId(null);
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setDeletedSourceId(null);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadTitles = async () => {
      const nextTitles: Record<string, string> = {};

      for (const source of sources) {
        nextTitles[source.id] = fallbackTitleFromUrl(source.url);
      }

      if (!isCancelled) {
        setSourceTitles(nextTitles);
      }

      await Promise.all(
        sources.map(async (source) => {
          const fetchedTitle = await fetchSourceTitle(source.url);
          if (!fetchedTitle || isCancelled) return;

          setSourceTitles((currentTitles) => ({
            ...currentTitles,
            [source.id]: fetchedTitle,
          }));
        }),
      );
    };

    loadTitles();

    return () => {
      isCancelled = true;
    };
  }, [sources]);

  const openRenameDialog = (sourceId: string) => {
    setRenamedSourceId(sourceId);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = (nextName: string) => {
    if (!renamedSourceId) return;
    onRenameSource(renamedSourceId, nextName);
    setRenameDialogOpen(false);
    setRenamedSourceId(null);
  };

  const openDeleteDialog = (sourceId: string) => {
    setDeletedSourceId(sourceId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletedSourceId) return;
    onRemoveSource(deletedSourceId);
    setDeleteDialogOpen(false);
    setDeletedSourceId(null);
  };

  const renamedSource = renamedSourceId
    ? (sources.find((source) => source.id === renamedSourceId) ?? null)
    : null;
  const renameInitialValue = renamedSource
    ? renamedSource.customTitle?.trim() ||
      sourceTitles[renamedSource.id] ||
      fallbackTitleFromUrl(renamedSource.url)
    : "";

  return (
    <>
      <Card className="flex h-full min-h-0 flex-col">
        <CardHeader className="space-y-4 px-3 pt-3 pb-1 border-b border-white/5">
          <div className="flex items-start justify-center">
            <div className="w-full">
              <CardTitle className="flex items-center gap-2 text-md">
                {!collapsed && (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                )}

                {!collapsed && "Źródła"}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label={
                collapsed ? "Rozwiń sekcję źródeł" : "Zwiń sekcję źródeł"
              }
              className="h-8 w-8 shrink-0 translate-y-[-5px]"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2 pb-4">
              <Label htmlFor="source-url">Nowe źródło</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="source-url"
                  placeholder="https://example.com/artykul"
                  value={sourceUrl}
                  onChange={(event) => onSourceUrlChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") onAddSource();
                  }}
                />
                <Button
                  onClick={onAddSource}
                  aria-label="Dodaj źródło"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {sources.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/40 p-4 text-center text-sm text-muted-foreground">
                Brak źródeł. Dodaj pierwszy link, aby pojawił się na liście.
              </div>
            ) : (
              <ul className="space-y-2">
                {sources.map((source) => (
                  <li
                    key={source.id}
                    className="group rounded-xl border border-border/60 bg-background/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative h-5 w-5 shrink-0">
                        {buildFaviconUrl(source.url) ? (
                          <img
                            src={buildFaviconUrl(source.url)}
                            alt=""
                            className="h-5 w-5 rounded-sm transition-opacity group-hover:opacity-0 group-focus-within:opacity-0"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-muted text-muted-foreground transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
                            <FileText className="h-3 w-3" />
                          </span>
                        )}
                        <ActionDropdown
                          align="start"
                          side="right"
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute inset-0 h-5 w-5 rounded-sm p-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                              aria-label="Więcej akcji dla źródła"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          }
                        >
                          <DropdownMenuItem
                            onClick={() => openRenameDialog(source.id)}
                          >
                            <Pencil className="h-4 w-4" />
                            Zmień nazwę źródła
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(source.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Usuń źródło
                          </DropdownMenuItem>
                        </ActionDropdown>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm leading-5 text-foreground/90">
                          {source.customTitle?.trim() ||
                            sourceTitles[source.id] ||
                            fallbackTitleFromUrl(source.url)}
                        </span>
                      </span>
                      <Checkbox
                        checked={source.checked}
                        onCheckedChange={() => onToggleSource(source.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        )}
      </Card>

      <RenameSourceDialog
        open={renameDialogOpen}
        onOpenChange={handleRenameDialogOpenChange}
        initialValue={renameInitialValue}
        onSubmit={handleRenameSubmit}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogOpenChange}
        title="Usunąć źródło?"
        description="Tej akcji nie można cofnąć. Źródło zostanie usunięte z listy."
        confirmLabel="Usuń"
        cancelLabel="Anuluj"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
