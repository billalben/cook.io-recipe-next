export interface EdamamImage {
  url: string;
  width: number;
  height: number;
}

export interface EdamamImages {
  THUMBNAIL: EdamamImage;
  SMALL: EdamamImage;
  REGULAR: EdamamImage;
  LARGE: EdamamImage;
}

export interface RecipeIngredient {
  text: string;
  quantity: number;
  measure: string | null;
  food: string;
  weight: number;
  foodId: string;
}

export interface Recipe {
  uri: string;
  label: string;
  image: string;
  images: EdamamImages;
  source: string;
  url: string;
  calories: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  dietLabels: string[];
  healthLabels: string[];
  ingredientLines: string[];
  ingredients: RecipeIngredient[];
  yield: number;
}

export interface Hit {
  recipe: Recipe;
  _links: {
    self: { href: string };
  };
}

export interface NextLink {
  href: string;
}

export interface EdamamResponse {
  from: number;
  to: number;
  count: number;
  _links: {
    next?: NextLink;
  };
  hits: Hit[];
}

export interface CardRecipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
}

export const CARD_FIELDS = ["uri", "label", "image", "totalTime"] as const;

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
