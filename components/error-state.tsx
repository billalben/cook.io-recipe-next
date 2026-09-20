"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, UtensilsCrossed } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="alert"
      className={`flex flex-col items-center text-center ${
        compact ? "py-8 gap-3" : "py-16 gap-4"
      }`}
    >
      <div
        className={`rounded-full bg-primary-container text-on-primary-container flex items-center justify-center ${
          compact ? "w-11 h-11" : "w-14 h-14"
        }`}
      >
        <UtensilsCrossed className={compact ? "w-5 h-5" : "w-6 h-6"} />
      </div>

      <h3
        className={`font-display text-[var(--color-on-surface)] ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        Recipes are taking a break
      </h3>

      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm">
        {message}
      </p>

      <button
        type="button"
        onClick={handleRetry}
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
