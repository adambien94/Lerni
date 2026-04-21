import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type CreateNotebookModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNotebook: (title: string) => Promise<void>;
};

export function CreateNotebookModal({
  open,
  onOpenChange,
  onCreateNotebook,
}: CreateNotebookModalProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedTitle = title.trim();
    if (!sanitizedTitle) return;

    setIsSubmitting(true);
    void onCreateNotebook(sanitizedTitle)
      .then(() => {
        setTitle("");
        onOpenChange(false);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz nowy notatnik</DialogTitle>
          <DialogDescription>
            Wpisz nazwę notatnika, który chcesz utworzyć.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="notebook-title"
            name="title"
            placeholder="np. Untitled notebook"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              Utwórz notatnik
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
