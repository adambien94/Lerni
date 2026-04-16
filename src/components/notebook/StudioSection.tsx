import {
  PanelRight,
  Minimize2,
  FlaskConical,
  TestTube2,
  Edit,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flashcards } from "@/components/notebook/Flashcards";

type StudioSectionProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFlashcardsOpenChange?: (isOpen: boolean) => void;
};

export function StudioSection({
  collapsed,
  onToggleCollapse,
  onFlashcardsOpenChange,
}: StudioSectionProps) {
  const [activeStudioView, setActiveStudioView] = useState<
    "menu" | "flashcards"
  >("menu");
  const isFlashcardsOpen = activeStudioView === "flashcards";

  const setStudioView = (view: "menu" | "flashcards") => {
    setActiveStudioView(view);
    onFlashcardsOpenChange?.(view === "flashcards");
  };

  const handleHeaderAction = () => {
    if (isFlashcardsOpen) {
      setStudioView("menu");
      return;
    }
    onToggleCollapse();
  };

  return (
    <Card className="flex h-full min-h-0 flex-col">
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
              {!collapsed && isFlashcardsOpen ? (
                <span className="text-muted-foreground">{"→ Fiszki"}</span>
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
                : isFlashcardsOpen
                  ? "Zamknij fiszki"
                  : "Zwiń sekcję Studio"
            }
            className="h-8 w-8 shrink-0 translate-y-[-5px]"
          >
            {isFlashcardsOpen ? (
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
              isFlashcardsOpen
                ? "pointer-events-none grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStudioView("flashcards")}
                  className="group w-full rounded-2xl bg-linear-to-br from-emerald-900/35 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]"
                  aria-expanded={isFlashcardsOpen}
                >
                  <div className="flex items-center gap-3 text-emerald-300">
                    <div>
                      <FlaskConical className="h-4 w-4" />
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

                <button className="group w-full rounded-2xl bg-linear-to-br from-violet-900/40 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]">
                  <div className="flex items-center gap-3 text-violet-300">
                    <div>
                      <TestTube2 className="h-4 w-4" />
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
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-out ${
              isFlashcardsOpen
                ? "mt-2 grid-rows-[1fr] opacity-100"
                : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <Flashcards />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
