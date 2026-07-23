"use client";

import { useSavedRecipes } from "@/hooks/use-saved-recipes";
import { RecipeCard } from "@/components/recipe-card";
import { SkeletonCard } from "@/components/skeleton-card";

export default function SavedRecipesPage() {
  const { savedRecipes, loading } = useSavedRecipes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl md:text-3xl text-[var(--color-on-surface)] mb-8">
        All Saved Recipes
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : savedRecipes.length === 0 ? (
        <p className="text-[var(--color-on-surface-variant)] text-center py-16 text-lg">
          You don&apos;t save any recipes yet!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {savedRecipes.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image}
              cookingTime={recipe.cookingTime}
              uri={`http://www.edamam.com/ontologies/edamam.owl#recipe_${recipe.id}`}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
