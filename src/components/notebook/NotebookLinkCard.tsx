import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type NotebookLinkCardProps = {
  id: string;
  title: string;
  meta: string;
  bgClass: string;
  onEditTitle: () => void;
  onDelete: () => void;
};

export function NotebookLinkCard({
  id,
  title,
  meta,
  bgClass,
  onEditTitle,
  onDelete,
}: NotebookLinkCardProps) {
  return (
    <Card className="group overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5">
      <CardContent className="relative flex min-h-[190px] flex-col justify-between p-5">
        <div className="relative z-20 self-end">
          <ActionDropdown
            align="end"
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full cursor-pointer"
                aria-label={`Wiecej opcji dla ${title}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuItem onClick={onEditTitle}>
              <Pencil className="h-4 w-4" />
              Edytuj tytul
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Usun
            </DropdownMenuItem>
          </ActionDropdown>
        </div>

        <Link to={`/notebook/${id}`} className="absolute inset-0 z-10" />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${bgClass} opacity-40`}
        />

        <div className="pointer-events-none relative z-20">
          <h2 className="line-clamp-2 text-2xl font-base text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{meta}</p>
        </div>
      </CardContent>
    </Card>
  );
}
