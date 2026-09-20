import { NextRequest, NextResponse } from "next/server";
import {
  EDAMAM_CACHE_HEADERS,
  EdamamError,
  fetchEdamam,
  friendlyErrorMessage,
  rewriteNextLink,
} from "@/lib/edamam";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchEdamam(request.nextUrl.searchParams);
    const nextHref = rewriteNextLink(data._links?.next?.href);

    if (data._links) {
      data._links.next = nextHref ? { href: nextHref } : undefined;
    }

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
