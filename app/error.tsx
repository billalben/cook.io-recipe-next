"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <ErrorState
        message="Something went wrong while loading this page. Please try again."
        onRetry={retry}
      />
    </div>
  );
}
