import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildEdamamUrl } from "@/lib/api";
import { DetailContent } from "./detail-content";
import type { Recipe } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchRecipe(id: string): Promise<Recipe | null> {
  try {
    const url = buildEdamamUrl({}, id);
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.recipe ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await fetchRecipe(id);
  if (!recipe) return { title: "Recipe Not Found — Cook.io" };
  return {
    title: `${recipe.label} — Cook.io`,
    description: `${recipe.label} by ${recipe.source}. ${recipe.ingredientLines?.length ?? 0} ingredients.`,
    openGraph: {
      title: recipe.label,
      description: `Recipe by ${recipe.source}`,
      images: [recipe.image],
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await fetchRecipe(id);
  if (!recipe) notFound();

  return <DetailContent recipe={recipe} recipeId={id} />;
}
