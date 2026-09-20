import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
        <UtensilsCrossed className="w-7 h-7" />
      </div>
      <h1 className="font-display text-2xl text-[var(--color-on-surface)]">
        Page not found
      </h1>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
