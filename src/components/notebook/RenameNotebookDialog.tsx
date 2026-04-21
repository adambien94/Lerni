import { useEffect, useState, type FormEvent } from "react";
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

type RenameNotebookDialogProps = {
  open: boolean;
  initialTitle: string;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => Promise<void>;
};

export function RenameNotebookDialog({
  open,
  initialTitle,
  onOpenChange,
  onSave,
}: RenameNotebookDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setErrorMessage(null);
    }
  }, [initialTitle, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    void onSave(value)
      .then(() => onOpenChange(false))
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Nie udalo sie zaktualizowac tytulu notatnika.";
        setErrorMessage(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nadaj nazwę notatnikowi</DialogTitle>
          <DialogDescription>
            Notatnik został utworzony. Ustaw własny tytuł teraz lub później.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="notebook-rename-title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            placeholder="np. Matematyka - egzamin"
          />
          {errorMessage ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Później
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              Zapisz tytuł
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
