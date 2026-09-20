import { z } from "zod";

export const EdamamImageSchema = z
  .object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  })
  .loose();

export const EdamamImagesSchema = z
  .object({
    THUMBNAIL: EdamamImageSchema.optional(),
    SMALL: EdamamImageSchema.optional(),
    REGULAR: EdamamImageSchema.optional(),
    LARGE: EdamamImageSchema.optional(),
  })
  .loose();

export const RecipeIngredientSchema = z
  .object({
    text: z.string(),
    quantity: z.number(),
    measure: z.string().nullable().optional(),
    food: z.string(),
    weight: z.number(),
    foodId: z.string(),
  })
  .loose();

export const CardRecipeSchema = z
  .object({
    uri: z.string(),
    label: z.string(),
    image: z.string().catch(""),
    totalTime: z.number().catch(0),
  })
  .loose();

export const RecipeSchema = z
  .object({
    uri: z.string(),
    label: z.string(),
    image: z.string().catch(""),
    images: EdamamImagesSchema.optional(),
    source: z.string().catch(""),
    url: z.string().catch(""),
    calories: z.number().catch(0),
    totalTime: z.number().catch(0),
    cuisineType: z.array(z.string()).optional(),
    mealType: z.array(z.string()).optional(),
    dishType: z.array(z.string()).optional(),
    dietLabels: z.array(z.string()).optional(),
    healthLabels: z.array(z.string()).optional(),
    ingredientLines: z.array(z.string()).optional(),
    ingredients: z.array(RecipeIngredientSchema).optional(),
    yield: z.number().catch(0),
  })
  .loose();

export const CardHitSchema = z
  .object({
    recipe: CardRecipeSchema,
  })
  .loose();

export const NextLinkSchema = z
  .object({
    href: z.string(),
  })
  .loose();

export const EdamamResponseSchema = z
  .object({
    from: z.number().optional(),
    to: z.number().optional(),
    count: z.number().optional(),
    _links: z
      .object({
        next: NextLinkSchema.optional(),
      })
      .loose()
      .optional(),
    hits: z
      .array(z.unknown())
      .default([])
      .transform((entries) =>
        entries.flatMap((entry) => {
          const result = CardHitSchema.safeParse(entry);
          return result.success ? [result.data] : [];
        })
      ),
  })
  .loose();

export const RecipeDetailSchema = z
  .object({
    recipe: RecipeSchema.optional(),
  })
  .loose();

export type EdamamImage = z.infer<typeof EdamamImageSchema>;
export type EdamamImages = z.infer<typeof EdamamImagesSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type CardHit = z.infer<typeof CardHitSchema>;
export type NextLink = z.infer<typeof NextLinkSchema>;
export type EdamamResponse = z.infer<typeof EdamamResponseSchema>;
