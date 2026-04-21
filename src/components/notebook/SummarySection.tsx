import { BookOpenText, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotebookSummaryDto } from "@/types/notebook";

type SummarySectionProps = {
  checkedSourcesCount: number;
  summary: NotebookSummaryDto | null;
  isGenerating: boolean;
  generateError: string | null;
  onGenerateSummary: () => void;
};

export function SummarySection({
  checkedSourcesCount,
  summary,
  isGenerating,
  generateError,
  onGenerateSummary,
}: SummarySectionProps) {
  const sourceLabel = checkedSourcesCount === 1 ? "źródło" : "źródeł";
  const canGenerate = checkedSourcesCount > 0 && !isGenerating;

  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader className="border-b border-white/5 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-md">
            <BookOpenText className="h-4 w-4 text-muted-foreground" />
            Podsumowanie
          </CardTitle>
          <Button
            type="button"
            size="sm"
            disabled={!canGenerate}
            onClick={onGenerateSummary}
            className="shrink-0 gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generowanie…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Wygeneruj (Gemini)
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Podsumowanie AI
          <span className="text-muted-foreground/80">
            · {checkedSourcesCount} {sourceLabel} zaznaczonych
          </span>
        </div>

        {generateError ? (
          <p className="text-sm text-destructive mb-1" role="alert">
            {generateError}
          </p>
        ) : null}

        {!summary?.contentMarkdown?.trim() && !isGenerating ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Zaznacz źródła na liście po lewej, potem użyj przycisku „Wygeneruj
            (Gemini)”. Treść stron zostanie pobrana po stronie serwera, a model
            przygotuje streszczenie w Markdown.
          </p>
        ) : null}

        {isGenerating && !summary?.contentMarkdown?.trim() ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            Pobieranie stron i generowanie podsumowania…
          </div>
        ) : null}

        {summary?.contentMarkdown?.trim() ? (
          <article className="markdown-summary mt-3 space-y-3 text-sm leading-7 text-muted-foreground [&_a]:text-emerald-400/90 [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:pt-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:marker:text-muted-foreground/80 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...rest }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...rest}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {summary.contentMarkdown}
            </ReactMarkdown>
          </article>
        ) : null}
      </CardContent>
    </Card>
  );
}
