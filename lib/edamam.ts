import { buildEdamamUrl } from "@/lib/api";
import {
  EdamamResponseSchema,
  RecipeDetailSchema,
  type EdamamResponse,
  type Recipe,
} from "@/lib/schemas";

export const EDAMAM_REVALIDATE = 86400;
export const EDAMAM_STALE_WHILE_REVALIDATE = 604800;

export const EDAMAM_CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${EDAMAM_REVALIDATE}, stale-while-revalidate=${EDAMAM_STALE_WHILE_REVALIDATE}`,
} as const;

export class EdamamError extends Error {
  status: number;
  rateLimited: boolean;

  constructor(message: string, status: number, rateLimited = false) {
    super(message);
    this.name = "EdamamError";
    this.status = status;
    this.rateLimited = rateLimited;
  }
}

interface EdamamErrorBody {
  message?: string;
  error?: string;
  errors?: { error?: string }[];
}

function isRateLimited(status: number, message: string): boolean {
  return status === 429 || /limit/i.test(message);
}

function errorMessageFromBody(body: EdamamErrorBody | null, status: number): string {
  return (
    body?.message ||
    body?.errors?.[0]?.error ||
    body?.error ||
    `Request failed (${status})`
  );
}

export function isRateLimitedMessage(message: string): boolean {
  return /limit/i.test(message);
}

export function friendlyErrorMessage(message: string): string {
  if (isRateLimitedMessage(message)) {
    return "Recipes are taking a break for a bit. Please try again later.";
  }
  return message || "Something went wrong while loading recipes.";
}

async function fetchEdamamJson(
  queries?: URLSearchParams,
  id?: string
): Promise<unknown> {
  const url = buildEdamamUrl(queries, id);
  const res = await fetch(url, {
    next: { revalidate: EDAMAM_REVALIDATE, tags: ["edamam"] },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as EdamamErrorBody | null;
    const message = errorMessageFromBody(body, res.status);
    throw new EdamamError(message, res.status, isRateLimited(res.status, message));
  }

  return res.json();
}

export async function fetchEdamamList(
  queries: URLSearchParams
): Promise<EdamamResponse> {
  const raw = await fetchEdamamJson(queries);
  const parsed = EdamamResponseSchema.safeParse(raw);

  if (!parsed.success) {
    throw new EdamamError("Unexpected response from the recipe service", 502);
  }

  return parsed.data;
}

export async function fetchEdamamDetail(id: string): Promise<Recipe | null> {
  const raw = await fetchEdamamJson(undefined, id);
  const parsed = RecipeDetailSchema.safeParse(raw);

  if (!parsed.success) return null;
  return parsed.data.recipe ?? null;
}

export function rewriteNextLink(nextHref: string | undefined): string | null {
  if (!nextHref) return null;

  try {
    const url = new URL(nextHref);
    url.searchParams.delete("app_id");
    url.searchParams.delete("app_key");
    return `/api/recipes?${url.searchParams.toString()}`;
  } catch {
    return null;
  }
}
