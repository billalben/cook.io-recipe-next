"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CardRecipe } from "@/lib/types";

const EMPTY_RECIPES: CardRecipe[] = [];

function loadFromStorage(): CardRecipe[] {
  if (typeof window === "undefined") return EMPTY_RECIPES;
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

let snapshot: CardRecipe[] | null = null;

function getSavedSnapshot(): CardRecipe[] {
  if (snapshot === null) snapshot = loadFromStorage();
  return snapshot;
}

function getServerSnapshot(): CardRecipe[] {
  return EMPTY_RECIPES;
}

function subscribe(onStoreChange: () => void) {
  const handleChange = () => {
    snapshot = null;
    onStoreChange();
  };
  window.addEventListener("storage", handleChange);
  window.addEventListener("snackbar", handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("snackbar", handleChange);
  };
}

function subscribeNoop() {
  return () => {};
}

function getIsClient() {
  return true;
}

function getIsServer() {
  return false;
}

export function useSavedRecipes() {
  const savedRecipes = useSyncExternalStore(
    subscribe,
    getSavedSnapshot,
    getServerSnapshot,
  );
  const isClient = useSyncExternalStore(subscribeNoop, getIsClient, getIsServer);

  const refresh = useCallback(() => {
    snapshot = null;
    window.dispatchEvent(new Event("snackbar"));
  }, []);

  return { savedRecipes, loading: !isClient, refresh };
}
