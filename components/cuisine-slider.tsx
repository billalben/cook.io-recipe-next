"use client";

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { ChevronRight } from "lucide-react";
import type { EdamamResponse } from "@/lib/types";

const CARD_FIELDS = "uri,label,image,totalTime";

const CUISINES = [
  { label: "Asian", type: "asian" },
  { label: "French", type: "french" },
] as const;

export function CuisineSliders() {
  const [data, setData] = useState<Record<string, EdamamResponse | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const results: Record<string, EdamamResponse | null> = {};

      for (const cuisine of CUISINES) {
        try {
          const params = new URLSearchParams({
            type: "public",
            cuisineType: cuisine.type,
            field: CARD_FIELDS,
          });
          const res = await fetch(`/api/recipes?${params.toString()}`);
          results[cuisine.label] = await res.json();
        } catch {
          results[cuisine.label] = null;
        }
      }

      if (!cancelled) {
        setData(results);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

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
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {(data[cuisine.label]?.hits ?? []).map((hit) => (
                  <div
                    key={hit.recipe.uri}
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
                <a
                  href={`/recipes?cuisineType=${cuisine.type}`}
                  className="min-w-[180px] max-w-[200px] flex-shrink-0 h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-outline)] hover:border-primary transition-colors p-6 gap-2"
                >
                  <span className="text-sm font-medium text-[var(--color-on-surface)]">
                    Show More
                  </span>
                  <ChevronRight className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
