import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EdamamError, fetchEdamam, friendlyErrorMessage } from "@/lib/edamam";
import { ErrorState } from "@/components/error-state";
import { DetailContent } from "./detail-content";
import type { Recipe } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

type RecipeResult =
  | { status: "ok"; recipe: Recipe }
  | { status: "notFound" }
  | { status: "error"; message: string };

async function fetchRecipe(id: string): Promise<RecipeResult> {
  try {
    const data = await fetchEdamam<{ recipe: Recipe }>(undefined, id);
    if (!data.recipe) return { status: "notFound" };
    return { status: "ok", recipe: data.recipe };
  } catch (err) {
    if (err instanceof EdamamError && err.status === 404) {
      return { status: "notFound" };
    }

    return {
      status: "error",
      message:
        err instanceof EdamamError
          ? friendlyErrorMessage(err.message)
          : "Something went wrong while loading this recipe.",
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchRecipe(id);

  if (result.status === "notFound") {
    return { title: "Recipe Not Found — Cook.io" };
  }
  if (result.status === "error") {
    return { title: "Recipe — Cook.io" };
  }

  const { recipe } = result;
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
  const result = await fetchRecipe(id);

  if (result.status === "notFound") notFound();

  if (result.status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <ErrorState message={result.message} />
      </div>
    );
  }

  return <DetailContent recipe={result.recipe} recipeId={id} />;
}
