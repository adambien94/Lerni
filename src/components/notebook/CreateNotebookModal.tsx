import { NotebookText, X, Edit } from "lucide-react";
import { useEffect, useState, type AnimationEvent } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CreateNotebookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateNotebookModal({
  isOpen,
  onClose,
}: CreateNotebookModalProps) {
  const [title, setTitle] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  const visible = isOpen || isLeaving;

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setIsLeaving(false);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!visible || isLeaving) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLeaving(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, isLeaving]);

  const handlePanelAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (!isLeaving || event.animationName !== "modal-panel-out") {
      return;
    }
    setIsLeaving(false);
    onClose();
  };

  const requestClose = () => {
    setIsLeaving(true);
  };

  if (!visible) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTitle("");
    setIsLeaving(true);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center px-4 py-6",
        isLeaving && "pointer-events-none",
      )}
      role="presentation"
    >
      <div
        className={cn(
          "absolute inset-0 bg-white/1 backdrop-blur-xs",
          isLeaving
            ? "animate-modal-backdrop-out"
            : "animate-modal-backdrop-in",
        )}
        onClick={requestClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full overflow-hidden max-w-3xl rounded-3xl border-none border-white/5 bg-background p-6 shadow-black/60 sm:p-8",
          isLeaving ? "animate-modal-panel-out" : "animate-modal-panel-in",
        )}
        onAnimationEnd={handlePanelAnimationEnd}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Colored glow halo behind the modal panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-12 rounded-3xl blur-3xl opacity-45 "
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40" />
        <div className="relative z-10">
          <div className="relative mb-6 flex items-start justify-between gap-4">
            <div className="w-full text-center">
              <h2 className="text-2xl text-left font-base tracking-tight text-foreground flex gap-4 items-center">
                <Edit className="h-6 w-6" />
                Utwórz nowy notatnik
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Zamknij modal tworzenia notatnika"
              onClick={requestClose}
              className="-mr-2 -mt-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form className="relative space-y-6" onSubmit={handleSubmit}>
            <label
              htmlFor="notebook-title"
              className="mb-3 flex items-center gap-3 text-zinc-300"
            >
              <NotebookText className="h-5 w-5 text-zinc-400" />
              <span className="text-sm sm:text-base">
                Wpisz nazwę notatnika, który chcesz utworzyć
              </span>
            </label>
            <Input
              id="notebook-title"
              name="title"
              placeholder="np. Untitled notebook"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              autoFocus
            />

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={requestClose}>
                Zamknij
              </Button>
              <Button type="submit" variant="default">
                Utwórz notatnik
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
