"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { SaveButton } from "@/components/save-button";
import { getTime, getBestImage } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

interface DetailContentProps {
  recipe: Recipe;
  recipeId: string;
}

export function DetailContent({ recipe, recipeId }: DetailContentProps) {
  const banner = getBestImage(recipe.images);
  const { time, timeUnit } = getTime(recipe.totalTime);
  const tags = [...(recipe.cuisineType ?? []), ...(recipe.dietLabels ?? []), ...(recipe.dishType ?? [])];

  function getTagType(tag: string): string {
    if (recipe.cuisineType?.includes(tag)) return "cuisineType";
    if (recipe.dietLabels?.includes(tag)) return "diet";
    return "dishType";
  }

  return (
    <div className="mx-auto max-w-5xl">
      {banner.url && (
        <figure className="w-full max-h-[400px] overflow-hidden relative aspect-[4/3]">
          <Image
            src={banner.url}
            alt={recipe.label}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </figure>
      )}

      <div className="p-4 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-display text-2xl md:text-3xl text-[var(--color-on-surface)]">
            {recipe.label ?? "Untitled"}
          </h1>
          <SaveButton recipeId={recipeId} />
        </div>

        <p className="text-[var(--color-on-surface-variant)] mb-6">
          <span className="text-sm">by</span>{" "}
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {recipe.source}
          </a>
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--color-outline-variant)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-on-surface)]">
              {recipe.ingredients?.length ?? 0}
            </div>
            <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Ingredients
            </div>
          </div>
          <div className="bg-[var(--color-outline-variant)] rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-[var(--color-on-surface)]">
              <Clock className="w-5 h-5" />
              <span>{time || "<1"}</span>
            </div>
            <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              {timeUnit}
            </div>
          </div>
          <div className="bg-[var(--color-outline-variant)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-on-surface)]">
              {Math.floor(recipe.calories)}
            </div>
            <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Calories
            </div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/recipes?${getTagType(tag)}=${encodeURIComponent(tag.toLowerCase())}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h2 className="font-display text-lg text-[var(--color-on-surface)] mb-4">
          Ingredients
          <span className="ml-2 text-sm font-normal text-[var(--color-on-surface-variant)]">
            for {recipe.yield} Servings
          </span>
        </h2>

        {recipe.ingredientLines && recipe.ingredientLines.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredientLines.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[var(--color-on-surface)]"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-on-surface-variant)]">
            No ingredient details available.
          </p>
        )}
      </div>
    </div>
  );
}
