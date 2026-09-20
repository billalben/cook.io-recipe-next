import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function RecipeNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
        <UtensilsCrossed className="w-7 h-7" />
      </div>
      <h1 className="font-display text-2xl text-[var(--color-on-surface)]">
        This recipe doesn&apos;t exist
      </h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm">
        We couldn&apos;t find the recipe you were looking for. It may have been
        removed or the link could be incorrect.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Browse recipes
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface)] text-sm font-medium hover:bg-[var(--color-outline-variant)] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
