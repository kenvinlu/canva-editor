import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('kw') || '';
    
    const result = await doRequest(keyword);
    return Response.json(result);
  } catch (error) {
    console.error('Template suggestion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(keyword: string): Promise<any> {
  return $get(`/template-suggestion?kw=${encodeURIComponent(keyword)}`);
}

