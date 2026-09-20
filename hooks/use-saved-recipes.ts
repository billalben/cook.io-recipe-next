"use client";

import { useState, useEffect, useCallback } from "react";
import type { CardRecipe } from "@/lib/types";

function loadFromStorage(): CardRecipe[] {
  if (typeof window === "undefined") return [];
  const keys = Object.keys(window.localStorage).filter((k) =>
    k.startsWith("cookio-recipe"),
  );
  const recipes: CardRecipe[] = [];
  for (const key of keys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) recipes.push(JSON.parse(raw));
    } catch {
      // skip invalid
    }
  }
  return recipes;
}

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] =
    useState<CardRecipe[]>(loadFromStorage);

  const refresh = useCallback(() => {
    setSavedRecipes(loadFromStorage());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("snackbar", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("snackbar", refresh);
    };
  }, [refresh]);

  return { savedRecipes, loading: false, refresh };
}
