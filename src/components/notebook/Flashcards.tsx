import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export function Flashcards() {
  const cards = useMemo<Flashcard[]>(
    () => [
      {
        id: "singleton-goal",
        front: "Jaki jest główny cel stosowania wzorca projektowego Singleton?",
        back: "Zapewnienie jednej instancji klasy i globalnego punktu dostępu do niej.",
      },
      {
        id: "factory-goal",
        front: "Po co stosuje się wzorzec Factory Method?",
        back: "Aby delegować tworzenie obiektów do podklas i oddzielić konstrukcję od użycia.",
      },
      {
        id: "observer-goal",
        front: "Co rozwiązuje wzorzec Observer?",
        back: "Powiadamianie wielu obiektów o zmianie stanu jednego obiektu (publish/subscribe).",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const total = cards.length;
  const current = cards[index]!;

  const goPrev = useCallback(() => {
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
    setIsFlipped(false);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % total);
    setIsFlipped(false);
  }, [total]);

  const flip = useCallback(() => setIsFlipped((value) => !value), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        flip();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flip, goNext, goPrev]);

  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-lg font-semibold leading-tight">Wzorce Fiszki</p>
          <p className="text-xs text-muted-foreground">Na podstawie 7 źródeł</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Więcej opcji">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="py-8">
        <div className="max-w-[590px] mx-auto">
          <div className="mt-6 text-center text-xs text-muted-foreground mb-4">
            Naciśnij spację, aby odwrócić • ← / → aby przejść
          </div>

          <button
            type="button"
            onClick={flip}
            className="group relative  w-full cursor-pointer select-none rounded-3xl  text-left transition  focus:outline-none"
            aria-label={isFlipped ? "Pokaż pytanie" : "Pokaż odpowiedź"}
          >
            {/* 3D flip container */}
            <div
              style={{ perspective: "1200px" }}
              className="relative z-10 w-full min-h-[360px] "
            >
              <div
                className="relative w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform-3d"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="pointer-events-none absolute left-6 top-6 text-lg text-muted-foreground">
                    {index + 1}/{total}
                  </div>
                  <div className="relative">
                    {/* Colored glow halo (subtle) - behind the card */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-6 rounded-3xl blur-3xl opacity-50 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.5),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.3),transparent_60%)]"
                    />

                    <div className="relative z-10 rounded-3xl flex min-h-[360px] items-center justify-center px-6 py-14 text-left bg-black/50 border border-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.05)]">
                      <div className="text-left text-2xl font-medium tracking-tight leading-snug">
                        {current.front}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 backface-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="pointer-events-none absolute left-6 top-6 text-lg text-muted-foreground">
                    {index + 1}/{total}
                  </div>
                  <div className="relative">
                    {/* Colored glow halo (subtle) - behind the card */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-6 rounded-3xl blur-3xl opacity-45 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.45),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.22),transparent_60%)]"
                    />

                    <div className="relative z-10 rounded-3xl flex min-h-[360px] items-center justify-center px-6 py-14 text-left bg-zinc-800 border border-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
                      <div className="text-left text-2xl font-medium tracking-tight leading-snug">
                        {current.back}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between max-w-[390px] mx-auto">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goPrev}
            aria-label="Poprzednia fiszka"
            className="text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIndex(0);
                setIsFlipped(false);
              }}
              className="h-9"
            >
              Reset
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goNext}
            aria-label="Następna fiszka"
            className="text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
