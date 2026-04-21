import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotebookTitleModal } from "@/components/notebook/NotebookTitleModal";
import { NotebookActionBar } from "@/components/notebook/NotebookActionBar";
import { NotebookLinkCard } from "@/components/notebook/NotebookLinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createNotebook, deleteNotebook, listNotebooks, renameNotebook } from "@/lib/notebooks";
import { supabase } from "@/lib/supabase";

const NOTEBOOK_BG_CLASSES = [
  "from-zinc-400/50 to-zinc-800/80",
  "from-violet-400/50 to-zinc-800/80",
  "from-emerald-400/50 to-zinc-800/80",
  "from-pink-400/50 to-zinc-800/80",
  "from-amber-400/50 to-zinc-800/80",
] as const;

function App() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  const [isEditTitleOpen, setIsEditTitleOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeNotebook, setActiveNotebook] = useState<{ id: string; title: string } | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [notebooks, setNotebooks] = useState<
    Array<{ id: string; title: string; meta: string; bgClass: string }>
  >([]);

  const refreshNotebooks = useCallback(async () => {
    const items = await listNotebooks();
    setNotebooks(
      items.map((item, index) => ({
        id: item.id,
        title: item.title,
        meta: `${new Date(item.updatedAt).toLocaleDateString()} · ${item.sourceCount} sources`,
        bgClass: NOTEBOOK_BG_CLASSES[index % NOTEBOOK_BG_CLASSES.length]!,
      })),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadNotebooks = async () => {
      try {
        const items = await listNotebooks();
        if (cancelled) return;
        setNotebooks(
          items.map((item, index) => ({
            id: item.id,
            title: item.title,
            meta: `${new Date(item.updatedAt).toLocaleDateString()} · ${item.sourceCount} sources`,
            bgClass: NOTEBOOK_BG_CLASSES[index % NOTEBOOK_BG_CLASSES.length]!,
          })),
        );
      } catch {
        if (!cancelled) {
          toast.error("Nie udalo sie zaladowac notatnikow.");
        }
      }
    };
    void loadNotebooks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateNotebook = async () => {
    const created = await createNotebook("Untitled notebook");
    navigate(`/notebook/${created.id}`, {
      state: { openRenameTitleModal: true },
    });
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotebooks = useMemo(
    () =>
      normalizedQuery
        ? notebooks.filter((notebook) =>
            notebook.title.toLowerCase().includes(normalizedQuery),
          )
        : notebooks,
    [normalizedQuery, notebooks],
  );

  const handleOpenEditTitle = (notebook: { id: string; title: string }) => {
    setActiveNotebook(notebook);
    setIsEditTitleOpen(true);
  };

  const handleEditTitle = async (title: string) => {
    if (!activeNotebook) return;
    await renameNotebook(activeNotebook.id, title);
    await refreshNotebooks();
    toast.success("Tytul notatnika zostal zaktualizowany.");
  };

  const handleOpenDelete = (notebook: { id: string; title: string }) => {
    setActiveNotebook(notebook);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteNotebook = async () => {
    if (!activeNotebook) return;
    try {
      await deleteNotebook(activeNotebook.id);
      await refreshNotebooks();
      toast.success("Notatnik zostal usuniety.");
    } catch {
      toast.error("Nie udalo sie usunac notatnika.");
    } finally {
      setIsDeleteConfirmOpen(false);
      setActiveNotebook(null);
    }
  };

  return (
    <>
      <header className="mx-auto w-full max-w-[1980px] space-y-6 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="relative">
            {/* <span className="pointer-events-none absolute -inset-2 -z-10 rounded-xl bg-primary/25 blur-xl" />
            <p className="bg-linear-to-r from-primary via-violet-400 to-cyan-300 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
              Lerni
            </p> */}
          </div>

          <Button type="button" variant="outline" onClick={handleLogout}>
            ← Wyloguj się
          </Button>
        </div>
      </header>
      <main className="min-h-scree max-w-[1360px] mx-auto w-full px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Moje notatniki
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Wybierz notatnik, aby przejść do jego widoku roboczego.
          </p>
        </div>
        <section className="mx-auto mt-8 w-full max-w-[1360px] space-y-4">
          <NotebookActionBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onCreateNotebook={() => {
              void handleCreateNotebook();
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              className="transition-all hover:-translate-y-0.5 border-dashed hover:border-white/20 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => {
                void handleCreateNotebook();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void handleCreateNotebook();
                }
              }}
            >
              <CardContent className="flex min-h-[190px] flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12  items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Utwórz nowy notatnik
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Otwórz formularz i zacznij od tytułu notatnika.
                </p>
              </CardContent>
            </Card>

            {filteredNotebooks.map((notebook) => (
              <NotebookLinkCard
                key={notebook.id}
                id={notebook.id}
                title={notebook.title}
                meta={notebook.meta}
                bgClass={notebook.bgClass}
                onEditTitle={() =>
                  handleOpenEditTitle({ id: notebook.id, title: notebook.title })
                }
                onDelete={() =>
                  handleOpenDelete({ id: notebook.id, title: notebook.title })
                }
              />
            ))}
          </div>
          {filteredNotebooks.length === 0 && searchQuery.trim() !== "" && (
            <p className="rounded-xl border border-dashed border-border/70 bg-background/30 px-4 py-6 text-center text-sm text-muted-foreground">
              Brak notatnikow pasujacych do frazy "{searchQuery}".
            </p>
          )}
        </section>
      </main>
      <NotebookTitleModal
        key={activeNotebook?.id ?? "notebook-title-modal"}
        open={isEditTitleOpen}
        onOpenChange={(open) => {
          setIsEditTitleOpen(open);
          if (!open) setActiveNotebook(null);
        }}
        onSubmitTitle={handleEditTitle}
        initialTitle={activeNotebook?.title ?? ""}
        dialogTitle="Edytuj tytul notatnika"
        dialogDescription="Zmien nazwe notatnika."
        submitLabel="Zapisz"
      />
      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => {
          setIsDeleteConfirmOpen(open);
          if (!open) setActiveNotebook(null);
        }}
        title="Usun notatnik?"
        description={`Tej operacji nie mozna cofnac. Notatnik "${activeNotebook?.title ?? ""}" zostanie trwale usuniety.`}
        confirmLabel="Usun"
        cancelLabel="Anuluj"
        onConfirm={() => {
          void handleDeleteNotebook();
        }}
      />
    </>
  );
}

export default App;
