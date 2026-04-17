import { Plus, Search } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NotebookActionBarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onCreateNotebook: () => void;
};

export function NotebookActionBar({
  searchQuery,
  onSearchQueryChange,
  onCreateNotebook,
}: NotebookActionBarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isSearchVisible = isSearchExpanded || Boolean(searchQuery.trim());

  const openSearch = () => {
    setIsSearchExpanded(true);
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleSearchBlur = () => {
    if (!searchQuery.trim()) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl py-3">
      {isSearchVisible ? (
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            onBlur={handleSearchBlur}
            placeholder="Szukaj notatnika po nazwie"
            aria-label="Szukaj notatnika po nazwie"
            className="pl-9"
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={openSearch}
          aria-label="Otwórz wyszukiwanie notatników"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
      <Button type="button" onClick={onCreateNotebook} variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Utwórz notatnik
      </Button>
    </div>
  );
}
