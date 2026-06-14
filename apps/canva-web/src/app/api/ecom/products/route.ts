import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const result = await doRequest(slug);
    return Response.json(result);
  } catch (error) {
    console.error('Fetch product by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(slug: string): Promise<any> {
  const filters: Record<string, any> = { slug: { $eq: slug }, populate: 'images' };
  return $get(`/products?${qs.stringify(filters)}`);
}
