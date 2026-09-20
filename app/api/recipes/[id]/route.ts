import { NextRequest, NextResponse } from "next/server";
import {
  EDAMAM_CACHE_HEADERS,
  EdamamError,
  fetchEdamam,
  friendlyErrorMessage,
} from "@/lib/edamam";
import type { Recipe } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await fetchEdamam<{ recipe: Recipe }>(
      request.nextUrl.searchParams,
      id
    );

    return NextResponse.json(data, { headers: EDAMAM_CACHE_HEADERS });
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
