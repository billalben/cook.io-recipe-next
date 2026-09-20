import { NextRequest, NextResponse } from "next/server";
import { buildEdamamUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = buildEdamamUrl(request.nextUrl.searchParams, id);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return NextResponse.json(
        errorBody ?? { error: "Failed to fetch recipe" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
