"use client";

import { useState, useCallback } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { CARD_FIELDS, type Hit, type EdamamResponse } from "@/lib/types";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Teatime"] as const;

export function MealTabs() {
  const [activeTab, setActiveTab] = useState<string>("Breakfast");
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(() => {
    const loaded = new Set<string>();
    fetchTabData("Breakfast", loaded);
    return loaded;
  });
  const [tabData, setTabData] = useState<Record<string, Hit[]>>({});
  const [error, setError] = useState<string | null>(null);

  async function fetchTabData(mealType: string, currentLoaded: Set<string>) {
    if (currentLoaded.has(mealType)) return;
    try {
      const params = new URLSearchParams({
        type: "public",
        mealType: mealType.toLowerCase(),
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
      const data: EdamamResponse = await res.json();
      const recipes = data.hits?.slice(0, 12) ?? [];
      setTabData((prev) => ({ ...prev, [mealType]: recipes }));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadedTabs((prev) => new Set(prev).add(mealType));
    }
  }

  const handleTabClick = useCallback((mealType: string) => {
    setActiveTab(mealType);
    setLoadedTabs((prev) => {
      if (prev.has(mealType)) return prev;
      fetchTabData(mealType, prev);
      return prev;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex = currentIndex;
    if (e.key === "ArrowRight") targetIndex = (currentIndex + 1) % MEAL_TYPES.length;
    else if (e.key === "ArrowLeft") targetIndex = (currentIndex - 1 + MEAL_TYPES.length) % MEAL_TYPES.length;
    else return;
    e.preventDefault();
    handleTabClick(MEAL_TYPES[targetIndex]);
  };

  const isTabLoading = (mealType: string) => !loadedTabs.has(mealType);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" role="tablist">
          {MEAL_TYPES.map((type, i) => (
            <button
              key={type}
              role="tab"
              aria-selected={activeTab === type}
              tabIndex={activeTab === type ? 0 : -1}
              onClick={() => handleTabClick(type)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === type
                  ? "bg-primary text-on-primary"
                  : "bg-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-outline)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {MEAL_TYPES.map((type) => (
          <div
            key={type}
            role="tabpanel"
            hidden={activeTab !== type}
          >
            {isTabLoading(type) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <p className="text-center py-12 text-red-500">
                Couldn&apos;t load recipes: {error}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {(tabData[type] ?? []).map((hit, i) => (
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
                <div className="mt-6 text-center">
                  <a
                    href={`/recipes?mealType=${type.toLowerCase()}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-outline-variant)] transition-colors"
                  >
                    Show more
                  </a>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
