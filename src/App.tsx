import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NotebookActionBar } from "@/components/notebook/NotebookActionBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLayoutStore } from "@/stores/layoutStore";

function App() {
  const navigate = useNavigate();
  const openCreateNotebookModal = useLayoutStore(
    (state) => state.openCreateNotebookModal,
  );
  const closeCreateNotebookModal = useLayoutStore(
    (state) => state.closeCreateNotebookModal,
  );

  useEffect(() => {
    closeCreateNotebookModal();
  }, [closeCreateNotebookModal]);

  const goToNotebookWithCreateModal = () => {
    openCreateNotebookModal();
    navigate("/notebook/new");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const notebooks = [
    {
      id: "1",
      title: "52 Essential JavaScript Frontend Interview Questions",
      meta: "20 paź 2025 · 6 źródeł",
      bgClass: "from-zinc-200/20 to-zinc-800/80",
    },
    {
      id: "2",
      title: "React Server Components",
      meta: "8 kwi 2026 · 18 źródeł",
      bgClass: "from-zinc-200/20 to-zinc-800/80",
    },
    {
      id: "3",
      title: "The Singleton Design Pattern Explained",
      meta: "31 paź 2025 · 7 źródeł",
      bgClass: "from-zinc-200/20 to-zinc-800/80",
    },
  ];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotebooks = normalizedQuery
    ? notebooks.filter((notebook) =>
        notebook.title.toLowerCase().includes(normalizedQuery),
      )
    : notebooks;

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

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            ← Wyloguj się
          </Button>
        </div>
      </header>
      <main className="min-h-scree max-w-[1360px] mx-auto w-full px-4 py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Moje notatniki
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Wybierz notatnik, aby przejść do jego widoku roboczego.
          </p>
        </div>
        <section className="mx-auto mt-8 w-full max-w-[1360px] space-y-4">
          <NotebookActionBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onCreateNotebook={goToNotebookWithCreateModal}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              className="transition-all hover:-translate-y-0.5 border-dashed hover:border-white/20 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={goToNotebookWithCreateModal}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  goToNotebookWithCreateModal();
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
              <Link
                key={notebook.id}
                to={`/notebook/${notebook.id}`}
                className="group"
              >
                <Card className="transition-transform duration-200 group-hover:-translate-y-0.5 overflow-hidden">
                  <CardContent className="relative flex min-h-[190px] flex-col justify-end p-5">
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${notebook.bgClass} opacity-40`}
                    />
                    <div className="relative z-10">
                      <h2 className="line-clamp-2 text-2xl font-base text-foreground">
                        {notebook.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {notebook.meta}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {filteredNotebooks.length === 0 && (
            <p className="rounded-xl border border-dashed border-border/70 bg-background/30 px-4 py-6 text-center text-sm text-muted-foreground">
              Brak notatnikow pasujacych do frazy "{searchQuery}".
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
