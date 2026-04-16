import {
  PanelRight,
  FlaskConical,
  TestTube2,
  Edit,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardHeader className="border-b border-border/50 pt-3 pb-1">
        <div className="flex items-start justify-center">
          <div className="w-full">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              {collapsed ? (
                ""
              ) : (
                <Edit className="h-4 w-4 text-muted-foreground" />
              )}

              {collapsed ? "" : "Studio"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Rozwiń sekcję Studio" : "Zwiń sekcję Studio"
            }
            className="h-8 w-8 shrink-0 translate-y-[-5px]"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-3 p-4 border-b border-border/50 pb-5">
          <button className="group w-full rounded-2xl  bg-linear-to-br from-emerald-900/35 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]">
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

          <button className="group w-full rounded-2xl  bg-linear-to-br from-violet-900/40 to-zinc-800/80 p-4 text-left transition-brightness duration-200 cursor-pointer hover:brightness-[1.1]">
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
        </CardContent>
      )}
    </Card>
  );
}
