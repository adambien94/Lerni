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

type NotebookTitleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitTitle: (title: string) => Promise<void>;
  initialTitle?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  submitLabel?: string;
};

export function NotebookTitleModal({
  open,
  onOpenChange,
  onSubmitTitle,
  initialTitle = "",
  dialogTitle = "Utworz nowy notatnik",
  dialogDescription = "Wpisz nazwe notatnika, ktory chcesz utworzyc.",
  submitLabel = "Zapisz",
}: NotebookTitleModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTitle(initialTitle);
      setErrorMessage(null);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedTitle = title.trim();
    if (!sanitizedTitle) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    void onSubmitTitle(sanitizedTitle)
      .then(() => {
        handleOpenChange(false);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Nie udalo sie zapisac nazwy notatnika. Sprobuj ponownie.";
        setErrorMessage(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
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
          {errorMessage ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
