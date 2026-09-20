import { FILTER_DATA } from "@/lib/filter-data";

const ALLOWED_VALUES = new Map<string, Set<string>>(
  FILTER_DATA.map((section) => [
    section.key,
    new Set(section.options.map((option) => option.value)),
  ])
);

const RADIO_KEYS = new Set(
  FILTER_DATA.filter((section) => section.type === "radio").map(
    (section) => section.key
  )
);

export const MAX_QUERY_LENGTH = 100;

export const MEAL_TABS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "teatime",
] as const;

export interface SanitizeResult {
  params: URLSearchParams;
  changed: boolean;
}

export function isRadioFilterKey(key: string): boolean {
  return RADIO_KEYS.has(key);
}

export function normalizeFilterValue(
  key: string,
  value: string
): string | null {
  const allowed = ALLOWED_VALUES.get(key);
  if (!allowed) return null;

  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || normalized.length > 64) return null;
  return allowed.has(normalized) ? normalized : null;
}

export function normalizeMealType(value: string | null | undefined): string | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  return (MEAL_TABS as readonly string[]).includes(lower) ? lower : null;
}

export function isValidRecipeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{10,200}$/.test(id);
}

function normalizeQuery(value: string): string | null {
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/\s+/g, " ");

  if (!cleaned) return null;
  return cleaned.slice(0, MAX_QUERY_LENGTH);
}

function isValidContinuation(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= 8192 &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

export function sanitizeRecipeSearchParams(input: URLSearchParams): SanitizeResult {
  const output = new URLSearchParams();
  const seen = new Map<string, Set<string>>();
  const entries = [...input.entries()];
  let changed = false;

  for (const [key, value] of entries) {
    if (key === "q") {
      const query = normalizeQuery(value);
      if (!query) {
        changed = true;
        continue;
      }
      if (query !== value) changed = true;
      output.set("q", query);
      continue;
    }

    const canonical = normalizeFilterValue(key, value);
    if (!canonical) {
      changed = true;
      continue;
    }
    if (canonical !== value) changed = true;

    if (RADIO_KEYS.has(key)) {
      if (seen.has(key)) {
        changed = true;
        continue;
      }
      seen.set(key, new Set([canonical]));
      output.append(key, canonical);
      continue;
    }

    const values = seen.get(key) ?? new Set<string>();
    if (values.has(canonical)) {
      changed = true;
      continue;
    }
    values.add(canonical);
    seen.set(key, values);
    output.append(key, canonical);
  }

  if ([...output.entries()].length !== entries.length) changed = true;

  return { params: output, changed };
}

export function sanitizeApiSearchParams(input: URLSearchParams): URLSearchParams {
  const { params: validated } = sanitizeRecipeSearchParams(input);
  const output = new URLSearchParams(validated);

  const seenFields = new Set<string>();
  for (const field of input.getAll("field")) {
    if (
      seenFields.size >= 32 ||
      !/^[A-Za-z][A-Za-z0-9]{0,39}$/.test(field) ||
      seenFields.has(field)
    ) {
      continue;
    }
    seenFields.add(field);
    output.append("field", field);
  }

  const continuation = input.get("_cont");
  if (continuation && isValidContinuation(continuation)) {
    output.set("_cont", continuation);
  }

  output.set("type", "public");
  return output;
}
