"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error?.name === "ChunkLoadError" ||
    error?.message?.includes("ChunkLoadError") ||
    error?.message?.includes("Loading chunk");

  useEffect(() => {
    console.error("App boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        {isChunkError ? "Application Update Detected" : "Something went wrong!"}
      </h2>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {isChunkError
          ? "The application assets were updated in the background and a chunk failed to load. Reloading the page will fetch the latest scripts."
          : error?.message || "An unexpected error occurred while loading this page."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (isChunkError) {
              window.location.reload();
            } else {
              reset();
            }
          }}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {isChunkError ? "Reload Page" : "Try Again"}
        </button>

        {isChunkError && (
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-muted/80 transition-all"
          >
            Retry Without Reload
          </button>
        )}
      </div>
    </div>
  );
}
