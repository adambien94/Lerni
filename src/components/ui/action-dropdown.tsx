import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActionDropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
};

export function ActionDropdown({
  trigger,
  children,
  align = "start",
  side = "bottom",
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
