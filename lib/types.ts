export type {
  EdamamImage,
  EdamamImages,
  RecipeIngredient,
  Recipe,
  CardHit as Hit,
  NextLink,
  EdamamResponse,
} from "@/lib/schemas";

export interface CardRecipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
}

export const CARD_FIELDS = [
  "uri",
  "label",
  "image",
  "totalTime",
] as const;

export const SEARCH_CARD_FIELDS = [
  "uri",
  "label",
  "image",
  "totalTime",
  "images",
  "source",
  "calories",
  "cuisineType",
  "dietLabels",
  "dishType",
  "yield",
  "ingredientLines",
  "ingredients",
  "url",
] as const;
