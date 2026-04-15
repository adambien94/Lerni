import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = React.HTMLAttributes<HTMLDivElement>;
type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function Field({ className, ...props }: FieldProps) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground/90", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldLabel };
