import { BookOpenText, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SummarySection() {
  return (
    <Card className="flex h-full min-h-0 flex-col border-border/80 bg-card/60">
      <CardHeader className="border-b border-border/50 pb-5">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <BookOpenText className="h-4 w-4 text-muted-foreground" />
          Podsumowanie
        </CardTitle>
        <CardDescription>
          Tu będzie wyświetlane podsumowanie wybranych artykułów.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-5">
        <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Podsumowanie AI
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Tu będzie treść podsumowania. Po podpięciu backendu można tu
            renderować gotową analizę artykułów ze wskazanych źródeł.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
