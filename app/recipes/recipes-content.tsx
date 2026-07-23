"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { FilterBar } from "@/components/filter-bar";
import type { EdamamResponse } from "@/lib/types";

const CARD_FIELDS = "uri,label,image,totalTime";
const DEFAULT_MEAL_TYPES = "breakfast,dinner,lunch,snack,teatime";

export function RecipesPageContent() {
  const searchParams = useSearchParams();

  const paramsString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", "public");
    params.set("field", CARD_FIELDS);

    if (!Array.from(searchParams.keys()).some((k) =>
      ["mealType", "dishType", "cuisineType", "diet", "health", "time", "ingr", "calories", "q"].includes(k)
    )) {
      params.set("mealType", DEFAULT_MEAL_TYPES);
    }

    return params.toString();
  }, [searchParams]);

  return <RecipesGrid key={paramsString} paramsString={paramsString} />;
}

function RecipesGrid({ paramsString }: { paramsString: string }) {
  const [state, setState] = useState<{
    recipes: EdamamResponse["hits"];
    nextUrl: string | null;
    hasLoaded: boolean;
    loadingMore: boolean;
  }>({
    recipes: [],
    nextUrl: null,
    hasLoaded: false,
    loadingMore: false,
  });

  const fetchingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchingRef.current = true;

    fetch(`/api/recipes?${paramsString}`)
      .then((res) => res.json())
      .then((data: EdamamResponse) => {
        if (cancelled) return;
        setState({
          recipes: data.hits ?? [],
          nextUrl: data._links?.next?.href ?? null,
          hasLoaded: true,
          loadingMore: false,
        });
        fetchingRef.current = false;
      })
      .catch(() => {
        if (cancelled) return;
        setState((prev) => ({ ...prev, hasLoaded: true, loadingMore: false }));
        fetchingRef.current = false;
      });

    return () => {
      cancelled = true;
      fetchingRef.current = false;
    };
  }, [paramsString]);

  const handleLoadMore = useCallback(async () => {
    if (!state.nextUrl || state.loadingMore || fetchingRef.current) return;

    setState((prev) => ({ ...prev, loadingMore: true }));

    try {
      const res = await fetch(state.nextUrl);
      const data: EdamamResponse = await res.json();

      setState((prev) => {
        const merged = [...prev.recipes, ...(data.hits ?? [])];
        const seen = new Set<string>();
        const unique = merged.filter((hit) => {
          if (seen.has(hit.recipe.uri)) return false;
          seen.add(hit.recipe.uri);
          return true;
        });
        return {
          ...prev,
          recipes: unique,
          nextUrl: data._links?.next?.href ?? null,
          loadingMore: false,
        };
      });
    } catch {
      setState((prev) => ({ ...prev, loadingMore: false }));
    }
  }, [state.nextUrl, state.loadingMore]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && state.nextUrl && !state.loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [state.nextUrl, state.loadingMore, handleLoadMore]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-var(--header-height))]">
      <FilterBar />

      <div className="flex-1 p-4 md:p-6">
        <h2 className="font-display text-xl md:text-2xl text-[var(--color-on-surface)] mb-6">
          All Recipes
        </h2>

        {!state.hasLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : state.recipes.length === 0 ? (
          <p className="text-[var(--color-on-surface-variant)] text-center py-12">
            No recipes found. Try different filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.recipes.map((hit, i) => (
                <RecipeCard
                  key={hit.recipe.uri}
                  title={hit.recipe.label}
                  image={hit.recipe.image}
                  cookingTime={hit.recipe.totalTime}
                  uri={hit.recipe.uri}
                  index={i}
                />
              ))}
            </div>

            {state.loadingMore && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-10" />

            {!state.nextUrl && state.hasLoaded && (
              <p className="text-center text-[var(--color-on-surface-variant)] py-8 text-sm">
                No more recipes to load.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
