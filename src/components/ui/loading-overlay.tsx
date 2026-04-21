import { Loader2 } from "lucide-react";

type LoadingOverlayProps = {
  loadingMessage: string;
};

export function LoadingOverlay({ loadingMessage }: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={loadingMessage}
    >
      <div className="text-center space-y-2">
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-foreground" />
        <p>{loadingMessage}</p>
      </div>
    </div>
  );
}
