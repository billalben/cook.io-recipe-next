import { NextRequest, NextResponse } from "next/server";
import { buildEdamamUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const queries: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    queries[key] = value;
  });

  const url = buildEdamamUrl(queries);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
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
