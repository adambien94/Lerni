import { PanelRight, FlaskConical, TestTube2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StudioSectionProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function StudioSection({
  collapsed,
  onToggleCollapse,
}: StudioSectionProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border-border/80 bg-card/60">
      <CardHeader className="border-b border-border/50 pb-5">
        <div className="flex items-start justify-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              {collapsed ? (
                ""
              ) : (
                <Edit className="h-4 w-4 text-muted-foreground" />
              )}

              {collapsed ? "" : "Studio"}
            </CardTitle>
            {!collapsed && (
              <CardDescription>
                Wybierz akcję dla aktualnego notatnika.
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Rozwiń sekcję Studio" : "Zwiń sekcję Studio"
            }
            className="h-8 w-8 shrink-0"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-3 p-4 border-b border-border/50 pb-5">
          <button className="group w-full rounded-2xl border border-border/70 bg-background/40 p-4 text-left transition-colors hover:bg-background/70">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/15 p-2 text-primary">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Fiszki</p>
                <p className="text-xs text-muted-foreground">
                  Wygeneruj zestaw do nauki.
                </p>
              </div>
            </div>
          </button>

          <button className="group w-full rounded-2xl border border-border/70 bg-background/40 p-4 text-left transition-colors hover:bg-background/70">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/15 p-2 text-primary">
                <TestTube2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Test</p>
                <p className="text-xs text-muted-foreground">
                  Sprawdź wiedzę z podsumowania.
                </p>
              </div>
            </div>
          </button>
        </CardContent>
      )}
    </Card>
  );
}
