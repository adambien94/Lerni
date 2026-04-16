import {
  PanelRight,
  Minimize2,
  BadgeQuestionMark,
  Edit,
  ChevronRight,
  MoreVertical,
  BookCopy,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flashcards } from "@/components/notebook/Flashcards";
import { Quiz } from "@/components/notebook/Quiz";

type StudioSectionProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** True, gdy otwarty jest widok fiszek lub quizu (poszerzenie kolumny Studio). */
  onStudioExpandedChange?: (expanded: boolean) => void;
};

export function StudioSection({
  collapsed,
  onToggleCollapse,
  onStudioExpandedChange,
}: StudioSectionProps) {
  const [activeStudioView, setActiveStudioView] = useState<
    "menu" | "flashcards" | "quiz"
  >("menu");
  const isExpandedView =
    activeStudioView === "flashcards" || activeStudioView === "quiz";

  const setStudioView = (view: "menu" | "flashcards" | "quiz") => {
    setActiveStudioView(view);
    onStudioExpandedChange?.(view !== "menu");
  };

  const handleHeaderAction = () => {
    if (isExpandedView) {
      setStudioView("menu");
      return;
    }
    onToggleCollapse();
  };

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="px-3 pt-3 pb-1 border-b border-white/5">
        <div className="flex items-start justify-center">
          <div className="w-full">
            <CardTitle className="flex items-center gap-2 text-md">
              {collapsed ? (
                ""
              ) : (
                <Edit className="h-4 w-4 text-muted-foreground" />
              )}

              {collapsed ? "" : "Studio"}
              {!collapsed && activeStudioView === "flashcards" ? (
                <span className="text-muted-foreground">{"→ Fiszki"}</span>
              ) : null}
              {!collapsed && activeStudioView === "quiz" ? (
                <span className="text-muted-foreground">{"→ Test"}</span>
              ) : null}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHeaderAction}
            aria-label={
              collapsed
                ? "Rozwiń sekcję Studio"
                : isExpandedView
                  ? "Zamknij widok Studio"
                  : "Zwiń sekcję Studio"
            }
            className="h-8 w-8 shrink-0 translate-y-[-5px]"
          >
            {isExpandedView ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="p-4 pb-5">
          <div
            className={`grid overflow-hidden transition-all duration-300 ease-out ${
              isExpandedView
                ? "pointer-events-none grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-3 border-b border-white/5 pb-4">
                <button
                  type="button"
                  className="group w-full rounded-2xl bg-linear-to-br from-emerald-900/35 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]"
                  aria-expanded={activeStudioView === "flashcards"}
                >
                  <div className="flex items-center gap-3 text-emerald-300">
                    <div>
                      <BookCopy className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Fiszki</p>
                      <p className="text-xs ">Wygeneruj zestaw do nauki.</p>
                    </div>
                    <div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className="group w-full rounded-2xl bg-linear-to-br from-violet-900/40 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]"
                  aria-expanded={activeStudioView === "quiz"}
                >
                  <div className="flex items-center gap-3 text-violet-300">
                    <div>
                      <BadgeQuestionMark className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Test</p>
                      <p className="text-xs ">Sprawdź wiedzę z podsumowania.</p>
                    </div>
                    <div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              </div>
              <div className="pt-4">
                {/* MOCKED */}
                {[1].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStudioView("flashcards")}
                    className="group w-full rounded-2xl py-4 px-3 text-left transition-brightness duration-200 cursor-pointer hover:bg-zinc-800/50"
                    aria-expanded={activeStudioView === "quiz"}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <BookCopy className="h-5 w-5 text-emerald-100/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Fiszki ze wzorców
                        </p>
                        <p className="text-xs text-muted-foreground">
                          20 paź 2025 · 6 źródeł
                        </p>
                      </div>
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
                {[1, 2].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStudioView("quiz")}
                    className="group w-full rounded-2xl py-4 px-3 text-left transition-brightness duration-200 cursor-pointer hover:bg-zinc-800/50"
                    aria-expanded={activeStudioView === "quiz"}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <BadgeQuestionMark className="h-5 w-5 text-violet-200/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Singletion Quiz</p>
                        <p className="text-xs text-muted-foreground">
                          13 list 2025 · 4 źródeł
                        </p>
                      </div>
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-out ${
              isExpandedView
                ? "grid-rows-[1fr] opacity-100"
                : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              {activeStudioView === "flashcards" ? <Flashcards /> : null}
              {activeStudioView === "quiz" ? <Quiz /> : null}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
