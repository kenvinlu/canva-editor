import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('pi') || '1';
    const limit = searchParams.get('ps') || '10';
    const keyword = searchParams.get('kw') || '';
    
    const result = await doRequest(page, limit, keyword);
    return Response.json(result);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(page: string, limit: string, keyword: string): Promise<any> {
  return $get(`/projects/my-projects?pi=${page}&ps=${limit}&kw=${keyword}`);
}
