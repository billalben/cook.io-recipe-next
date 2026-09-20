"use client";

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { ErrorState } from "@/components/error-state";
import { Carousel } from "@/components/carousel";
import { ChevronRight } from "lucide-react";
import { CARD_FIELDS, type EdamamResponse } from "@/lib/types";

const CUISINES = [
  { label: "Asian", type: "asian" },
  { label: "French", type: "french" },
] as const;

export function CuisineSliders() {
  const [data, setData] = useState<Record<string, EdamamResponse | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const results: Record<string, EdamamResponse | null> = {};
      let firstError: string | null = null;

      for (const cuisine of CUISINES) {
        try {
          const params = new URLSearchParams({
            type: "public",
            cuisineType: cuisine.type,
          });
          for (const field of CARD_FIELDS) {
            params.append("field", field);
          }
          const res = await fetch(`/api/recipes?${params.toString()}`);
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(
              body?.message ||
                body?.errors?.[0]?.error ||
                body?.error ||
                `Request failed (${res.status})`
            );
          }
          results[cuisine.label] = await res.json();
        } catch (err) {
          results[cuisine.label] = null;
          firstError ??= (err as Error).message;
        }
      }

      if (!cancelled) {
        setData(results);
        setError(firstError);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleRetry = () => setReloadKey((key) => key + 1);

  return (
    <section className="py-8 space-y-10">
      {CUISINES.map((cuisine) => (
        <div key={cuisine.label}>
          <div className="mx-auto max-w-7xl px-4 mb-4">
            <h2 className="font-display text-xl md:text-2xl text-[var(--color-on-surface)]">
              Latest {cuisine.label} Recipes
            </h2>
          </div>

          <div className="mx-auto max-w-7xl px-4">
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="min-w-[180px] max-w-[200px] flex-shrink-0">
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            ) : error && !data[cuisine.label] ? (
              <ErrorState message={error} onRetry={handleRetry} />
            ) : (
              <Carousel ariaLabel={`Latest ${cuisine.label} recipes`}>
                {(data[cuisine.label]?.hits ?? []).map((hit) => (
                  <div
                    key={hit.recipe.uri}
                    data-carousel-item
                    className="min-w-[180px] max-w-[200px] flex-shrink-0"
                  >
                    <RecipeCard
                      title={hit.recipe.label}
                      image={hit.recipe.image}
                      cookingTime={hit.recipe.totalTime}
                      uri={hit.recipe.uri}
                    />
                  </div>
                ))}
                <div
                  data-carousel-item
                  className="min-w-[180px] max-w-[200px] flex-shrink-0"
                >
                  <a
                    href={`/recipes?cuisineType=${cuisine.type}`}
                    className="h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-outline)] hover:border-primary transition-colors p-6 gap-2"
                  >
                    <span className="text-sm font-medium text-[var(--color-on-surface)]">
                      Show More
                    </span>
                    <ChevronRight className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                  </a>
                </div>
              </Carousel>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
