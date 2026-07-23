import Link from "next/link";
import { HEALTH_TAGS, getTagLabel } from "@/lib/filter-data";

export function HealthTags() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-display text-xl md:text-2xl text-[var(--color-on-surface)] mb-6">
          Browse by Health Preference
        </h2>
        <div className="flex flex-wrap gap-2">
          {HEALTH_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/recipes?health=${encodeURIComponent(tag)}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:text-primary hover:border-primary transition-colors"
            >
              {getTagLabel(tag)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
