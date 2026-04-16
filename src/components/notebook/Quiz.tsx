import { useCallback, useMemo, useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_STUDIO_QUIZ } from "@/components/notebook/studioQuizSchema";

function polishSourcesWord(count: number): "źródło" | "źródła" | "źródeł" {
  if (count === 1) return "źródło";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "źródła";
  }
  return "źródeł";
}

export function Quiz() {
  const quiz = MOCK_STUDIO_QUIZ;
  const questions = quiz.questions;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(false);

  const current = questions[index]!;

  const progressLabel = useMemo(
    () => `${index + 1} / ${total}`,
    [index, total],
  );

  const goNext = useCallback(() => {
    setHintOpen(false);
    setSelectedOptionId(null);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setHintOpen(false);
    setSelectedOptionId(null);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  return (
    <section className="flex min-h-0 flex-col">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{quiz.title}</h2>
        <p className="text-xs text-muted-foreground">
          Na podstawie {quiz.sourceCount} {polishSourcesWord(quiz.sourceCount)}
        </p>
      </div>

      <div className="sm:px-6 pt-3">
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground tabular-nums">
            {progressLabel}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            aria-label="Edytuj quiz"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-5 min-h-0 flex-1 space-y-4">
          <p className="text-base font-semibold leading-snug text-foreground">
            {current.questionText}
          </p>

          <ul className="space-y-2.5" role="listbox" aria-label="Odpowiedzi">
            {current.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-4 text-left text-sm leading-relaxed transition-colors",
                      isSelected
                        ? "border-primary/70 bg-primary/15 text-foreground"
                        : "border-white/10 bg-zinc-900/60 text-muted-foreground hover:border-white/20 hover:bg-zinc-900/80",
                    )}
                  >
                    <span className="font-medium">{option.id}.</span>{" "}
                    {option.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHintOpen((open) => !open)}
            aria-expanded={hintOpen}
          >
            Podpowiedź
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                hintOpen ? "rotate-180" : "rotate-0",
              )}
            />
          </Button>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={goPrev}>
              Wstecz
            </Button>
            <Button type="button" size="sm" onClick={goNext}>
              Dalej
            </Button>
          </div>
        </div>
      </div>

      {hintOpen ? (
        <p className="rounded-xl mt-5 border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-muted-foreground">
          {current.hint}
        </p>
      ) : null}
    </section>
  );
}
