import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Call admin API custom endpoint: /product/:slug
    const result = await $get(`/product/${encodeURIComponent(slug)}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch product by slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


