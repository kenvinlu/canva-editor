import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";
    const result = await doRequest(locale);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Blog home error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function doRequest(locale: string): Promise<any> {
  const query = new URLSearchParams({
    locale,
  });
  return $get(`/blog-home?${query.toString()}`);
}


