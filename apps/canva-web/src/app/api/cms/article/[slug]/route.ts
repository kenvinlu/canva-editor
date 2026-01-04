import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const { slug } = await params;
    const locale = searchParams.get('locale') || 'en';
    
    const result = await doRequest(slug, locale);
    return Response.json(result);
  } catch (error) {
    console.error('Fetch article by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(slug: string, locale: string): Promise<any> {
  return $get(`/article/${slug}?locale=${locale}`);
}
