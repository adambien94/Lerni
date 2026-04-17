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

type RenameSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
  onSubmit: (nextName: string) => void;
};

export function RenameSourceDialog({
  open,
  onOpenChange,
  initialValue,
  onSubmit,
}: RenameSourceDialogProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [initialValue, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedName = value.trim();
    if (!sanitizedName) return;

    onSubmit(sanitizedName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień nazwę źródła</DialogTitle>
          <DialogDescription>
            Wpisz nową nazwę wyświetlaną na liście źródeł.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Nowa nazwa źródła"
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={!value.trim()}>
              Zapisz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
