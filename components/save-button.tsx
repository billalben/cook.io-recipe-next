"use client";

import { useState, useCallback } from "react";
import { Bookmark } from "lucide-react";
import { extractRecipeId } from "@/lib/utils";
import type { CardRecipe } from "@/lib/types";

function getStoredRecipe(recipeId: string): CardRecipe | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(`cookio-recipe${recipeId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeRecipe(recipeId: string, recipe: CardRecipe) {
  window.localStorage.setItem(
    `cookio-recipe${recipeId}`,
    JSON.stringify(recipe)
  );
}

function removeStoredRecipe(recipeId: string) {
  window.localStorage.removeItem(`cookio-recipe${recipeId}`);
}

interface SaveButtonProps {
  recipeId: string;
}

export function SaveButton({ recipeId }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(() => !!getStoredRecipe(recipeId));

  const handleClick = useCallback(async () => {
    if (isSaved) {
      removeStoredRecipe(recipeId);
      setIsSaved(false);
      window.dispatchEvent(new CustomEvent("snackbar", { detail: "Removed from Recipe book" }));
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}?type=public`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const recipe = data.recipe;
      if (recipe) {
        const cardRecipe: CardRecipe = {
          id: extractRecipeId(recipe.uri),
          title: recipe.label,
          image: recipe.image,
          cookingTime: recipe.totalTime,
        };
        storeRecipe(recipeId, cardRecipe);
        setIsSaved(true);
        window.dispatchEvent(new CustomEvent("snackbar", { detail: "Added to Recipe book" }));
      }
    } catch {
      window.dispatchEvent(new CustomEvent("snackbar", { detail: "Failed to save recipe" }));
    }
  }, [recipeId, isSaved]);

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isSaved
          ? "text-primary bg-primary-container"
          : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-outline-variant)]"
      }`}
      aria-label={isSaved ? "Remove from saved recipes" : "Add to saved recipes"}
    >
      <Bookmark
        className="w-4 h-4"
        fill={isSaved ? "currentColor" : "none"}
      />
    </button>
  );
}
