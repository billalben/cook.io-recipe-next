const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID!;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY!;
const EDAMAM_BASE_URL = process.env.EDAMAM_BASE_URL!;

export function buildEdamamUrl(
  queries?: Record<string, string>,
  id?: string
): string {
  const params = new URLSearchParams({
    type: "public",
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
  });

  if (queries) {
    for (const [key, value] of Object.entries(queries)) {
      params.append(key, value);
    }
  }

  if (id) {
    return `${EDAMAM_BASE_URL}/${id}?${params.toString()}`;
  }

  return `${EDAMAM_BASE_URL}?${params.toString()}`;
}
