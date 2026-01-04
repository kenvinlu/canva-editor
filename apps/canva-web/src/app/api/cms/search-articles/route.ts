import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('pi') || '1';
    const limit = searchParams.get('ps') || '10';
    const keyword = searchParams.get('kw') || '';
    const locale = searchParams.get('locale') || 'en';
    
    const result = await doRequest(page, limit, keyword, locale);
    return Response.json(result);
  } catch (error) {
    console.error('Search articles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(page: string, limit: string, keyword: string, locale: string): Promise<any> {
  return $get(`/search-articles?pi=${page}&ps=${limit}&kw=${keyword}&locale=${locale}`);
}
