import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DEFAULT_MEAL_TYPES, FILTER_KEYS } from "@/lib/filter-data";
import { RecipesPageContent } from "./recipes-content";

interface RecipesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const hasFilter = FILTER_KEYS.some((key) => params[key] !== undefined);

  if (!hasFilter) {
    const defaults = new URLSearchParams();
    for (const mealType of DEFAULT_MEAL_TYPES) {
      defaults.append("mealType", mealType);
    }
    redirect(`/recipes?${defaults.toString()}`);
  }

  return (
    <Suspense fallback={<RecipesSkeleton />}>
      <RecipesPageContent />
    </Suspense>
  );
}

function RecipesSkeleton() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 md:border-r md:border-[var(--color-outline)] md:min-h-[calc(100vh-var(--header-height))]" />
      <div className="flex-1 p-4">
        <h2 className="font-display text-xl md:text-2xl text-[var(--color-on-surface)] mb-6">
          All Recipes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-outline)]"
            >
              <div className="skeleton skeleton-card-banner" />
              <div className="p-3">
                <div className="skeleton skeleton-card-title" />
                <div className="skeleton skeleton-card-text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
