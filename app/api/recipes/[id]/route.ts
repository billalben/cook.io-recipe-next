import { NextRequest, NextResponse } from "next/server";
import {
  EDAMAM_CACHE_HEADERS,
  EdamamError,
  fetchEdamamDetail,
  friendlyErrorMessage,
} from "@/lib/edamam";
import { isValidRecipeId } from "@/lib/filter-validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidRecipeId(id)) {
    return NextResponse.json(
      { error: "Recipe not found", rateLimited: false },
      { status: 404 }
    );
  }

  try {
    const recipe = await fetchEdamamDetail(id);

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found", rateLimited: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe }, { headers: EDAMAM_CACHE_HEADERS });
  } catch (err) {
    if (err instanceof EdamamError) {
      return NextResponse.json(
        { error: friendlyErrorMessage(err.message), rateLimited: err.rateLimited },
        { status: err.status }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", rateLimited: false },
      { status: 500 }
    );
  }
}
