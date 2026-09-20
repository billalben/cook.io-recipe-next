const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID!;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY!;
const EDAMAM_BASE_URL = process.env.EDAMAM_BASE_URL!;

export function buildEdamamUrl(queries?: URLSearchParams, id?: string): string {
  const params = new URLSearchParams({
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
  });

  if (queries) {
    queries.forEach((value, key) => {
      if (key === "app_id" || key === "app_key") return;
      params.append(key, value);
    });
  }

  if (!params.has("type")) {
    params.set("type", "public");
  }

  if (id) {
    return `${EDAMAM_BASE_URL}/${id}?${params.toString()}`;
  }

  return `${EDAMAM_BASE_URL}?${params.toString()}`;
}
