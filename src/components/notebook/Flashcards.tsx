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
    <section className="">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-lg font-semibold leading-tight">Wzorce Fiszki</p>
          <p className="text-xs text-muted-foreground">Na podstawie 7 źródeł</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Więcej opcji">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="py-4">
        <div className="text-lg text-muted-foreground">
          {index + 1}/{total}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground mb-4">
          Naciśnij spację, aby odwrócić • ← / → aby przejść
        </div>

        <button
          type="button"
          onClick={flip}
          className="group relative min-h-[360px] w-full cursor-pointer select-none rounded-3xl border border-border/50 bg-background/10 px-6 py-14 text-left transition hover:bg-background/15"
          aria-label={isFlipped ? "Pokaż pytanie" : "Pokaż odpowiedź"}
        >
          <div className="text-center text-2xl font-semibold tracking-tight leading-snug">
            {isFlipped ? current.back : current.front}
          </div>
        </button>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goPrev}
            aria-label="Poprzednia fiszka"
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
