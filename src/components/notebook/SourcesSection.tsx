import { PanelLeft, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";

type SourcesSectionProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function SourcesSection({
  collapsed,
  onToggleCollapse,
}: SourcesSectionProps) {
  const {
    sourceUrl,
    setSourceUrl,
    addSource,
    clearSources,
    sources,
    toggleSource,
  } = useAppStore();

  return (
    <Card className="flex h-full min-h-0 flex-col border-border/80 bg-card/60">
      <CardHeader className="space-y-4 border-b border-border/50 pb-5">
        <div className="flex items-start justify-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              {!collapsed && (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}

              {!collapsed && "Źródła"}
            </CardTitle>
            {!collapsed && (
              <CardDescription>
                Dodawaj linki i zaznaczaj źródła do analizy.
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Rozwiń sekcję źródeł" : "Zwiń sekcję źródeł"
            }
            className="h-8 w-8 shrink-0"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        {!collapsed && (
          <div className="space-y-2">
            <Label htmlFor="source-url">Nowe źródło</Label>
            <div className="flex items-center gap-2">
              <Input
                id="source-url"
                placeholder="https://example.com/artykul"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addSource();
                }}
              />
              <Button size="icon" onClick={addSource} aria-label="Dodaj źródło">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSources}
              className="h-8 px-0 text-xs"
            >
              Wyczyść wszystkie
            </Button>
          </div>
        )}
      </CardHeader>

      {!collapsed && (
        <CardContent className="flex-1 overflow-y-auto p-4">
          {sources.length === 0 ? (
            <div className="flex h-full min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/40 p-4 text-center text-sm text-muted-foreground">
              Brak źródeł. Dodaj pierwszy link, aby pojawił się na liście.
            </div>
          ) : (
            <ul className="space-y-2">
              {sources.map((source) => (
                <li
                  key={source.id}
                  className="rounded-xl border border-border/60 bg-background/50 p-3"
                >
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={source.checked}
                      onChange={() => toggleSource(source.id)}
                      className="h-4 w-4 shrink-0 rounded border-border bg-card accent-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <span className="break-all text-sm leading-5 text-foreground/90">
                      {source.url}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}
