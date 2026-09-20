"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { ErrorState } from "@/components/error-state";
import { FilterBar } from "@/components/filter-bar";
import { CARD_FIELDS, type EdamamResponse } from "@/lib/types";
import { DEFAULT_MEAL_TYPES, FILTER_KEYS } from "@/lib/filter-data";

async function readErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return (
    body?.message ||
    body?.errors?.[0]?.error ||
    body?.error ||
    `Request failed (${res.status})`
  );
}

export function RecipesPageContent() {
  const searchParams = useSearchParams();

  const paramsString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", "public");
    params.delete("field");
    for (const field of CARD_FIELDS) {
      params.append("field", field);
    }

    if (!FILTER_KEYS.some((key) => searchParams.has(key))) {
      for (const mealType of DEFAULT_MEAL_TYPES) {
        params.append("mealType", mealType);
      }
    }

    return params.toString();
  }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-var(--header-height))]">
      <FilterBar />
      <RecipesGrid key={paramsString} paramsString={paramsString} />
    </div>
  );
}

function RecipesGrid({ paramsString }: { paramsString: string }) {
  const [state, setState] = useState<{
    recipes: EdamamResponse["hits"];
    nextUrl: string | null;
    hasLoaded: boolean;
    loadingMore: boolean;
    error: string | null;
    loadMoreError: string | null;
  }>({
    recipes: [],
    nextUrl: null,
    hasLoaded: false,
    loadingMore: false,
    error: null,
    loadMoreError: null,
  });

  const [reloadKey, setReloadKey] = useState(0);
  const fetchingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchingRef.current = true;

    setState((prev) => ({
      ...prev,
      hasLoaded: false,
      error: null,
      loadMoreError: null,
    }));

    fetch(`/api/recipes?${paramsString}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await readErrorMessage(res));
        return res.json();
      })
      .then((data: EdamamResponse) => {
        if (cancelled) return;
        setState({
          recipes: data.hits ?? [],
          nextUrl: data._links?.next?.href ?? null,
          hasLoaded: true,
          loadingMore: false,
          error: null,
          loadMoreError: null,
        });
        fetchingRef.current = false;
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          hasLoaded: true,
          loadingMore: false,
          error: err.message,
        }));
        fetchingRef.current = false;
      });

    return () => {
      cancelled = true;
      fetchingRef.current = false;
    };
  }, [paramsString, reloadKey]);

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!state.nextUrl || state.loadingMore || fetchingRef.current) return;

    setState((prev) => ({ ...prev, loadingMore: true, loadMoreError: null }));

    try {
      const res = await fetch(state.nextUrl);
      if (!res.ok) throw new Error(await readErrorMessage(res));
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
          loadMoreError: null,
        };
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loadingMore: false,
        loadMoreError: (err as Error).message,
      }));
    }
  }, [state.nextUrl, state.loadingMore]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          state.nextUrl &&
          !state.loadingMore &&
          !state.loadMoreError
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [state.nextUrl, state.loadingMore, state.loadMoreError, handleLoadMore]);

  return (
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
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={handleRetry} />
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

          {state.loadMoreError ? (
            <ErrorState
              compact
              message={state.loadMoreError}
              onRetry={handleLoadMore}
            />
          ) : (
            <div ref={sentinelRef} className="h-10" />
          )}

          {!state.nextUrl && !state.loadMoreError && state.hasLoaded && (
            <p className="text-center text-[var(--color-on-surface-variant)] py-8 text-sm">
              No more recipes to load.
            </p>
          )}
        </>
      )}
    </div>
  );
}
