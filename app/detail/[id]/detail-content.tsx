"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Maximize2, X } from "lucide-react";
import { SaveButton } from "@/components/save-button";
import { getTime, getBestImage } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

interface DetailContentProps {
  recipe: Recipe;
  recipeId: string;
}

export function DetailContent({ recipe, recipeId }: DetailContentProps) {
  const banner = getBestImage(recipe.images);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { time, timeUnit } = getTime(recipe.totalTime);
  const tags = [
    ...new Set([
      ...(recipe.cuisineType ?? []),
      ...(recipe.dietLabels ?? []),
      ...(recipe.dishType ?? []),
    ]),
  ];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function getTagType(tag: string): string {
    if (recipe.cuisineType?.includes(tag)) return "cuisineType";
    if (recipe.dietLabels?.includes(tag)) return "diet";
    return "dishType";
  }

  return (
    <div className="mx-auto max-w-5xl">
      {banner.url && (
        <>
          <figure className="w-full max-h-100 overflow-hidden relative aspect-4/3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="View full-size image"
              className="group absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              <Image
                src={banner.url}
                alt={recipe.label}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <span className="absolute right-3 bottom-3 rounded-full bg-black/50 p-2 text-white transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <Maximize2 className="w-4 h-4" />
              </span>
            </button>
          </figure>

          <dialog
            ref={dialogRef}
            aria-label="Recipe image"
            onClose={() => setIsOpen(false)}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            className="m-0 h-screen max-h-none w-screen max-w-none border-0 bg-black/90 p-0"
          >
            <div className="relative h-full w-full">
              <Image
                src={banner.url}
                alt={recipe.label}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close image"
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </dialog>
        </>
      )}

      <div className="p-4 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-display text-2xl md:text-3xl text-on-surface">
            {recipe.label ?? "Untitled"}
          </h1>
          <SaveButton recipeId={recipeId} />
        </div>

        <p className="text-on-surface-variant mb-6">
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
          <div className="bg-outline-variant/60 rounded-xl p-4 text-center transition-colors hover:bg-outline-variant">
            <div className="text-2xl font-bold text-on-surface">
              {recipe.ingredientLines?.length ??
                recipe.ingredients?.length ??
                0}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              Ingredients
            </div>
          </div>
          <div className="bg-outline-variant/60 rounded-xl p-4 text-center transition-colors hover:bg-outline-variant">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-on-surface">
              <Clock className="w-5 h-5" />
              <span>{time || "<1"}</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              {timeUnit}
            </div>
          </div>
          <div className="bg-outline-variant/60 rounded-xl p-4 text-center transition-colors hover:bg-outline-variant">
            <div className="text-2xl font-bold text-on-surface">
              {Math.floor(recipe.calories)}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
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

        <h2 className="font-display text-lg text-on-surface mb-4">
          Ingredients
          <span className="ml-2 text-sm font-normal text-on-surface-variant">
            for {recipe.yield} Servings
          </span>
        </h2>

        {recipe.ingredientLines && recipe.ingredientLines.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredientLines.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-on-surface"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant">
            No ingredient details available.
          </p>
        )}
      </div>
    </div>
  );
}
