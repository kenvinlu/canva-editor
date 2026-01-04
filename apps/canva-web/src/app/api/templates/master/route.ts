import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currentPostId = searchParams.get('currentPostId');
    const pageSize = searchParams.get('pageSize') || '4';
    
    if (!currentPostId) {
      return NextResponse.json(
        { error: 'currentPostId parameter is required' },
        { status: 400 }
      );
    }
    
    const result = await doRequest(parseInt(currentPostId), parseInt(pageSize));
    return Response.json(result);
  } catch (error) {
    console.error('Fetch recent templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(currentPostId: number, pageSize: number): Promise<any> {
  const query = {
    filters: {
      id: { $ne: currentPostId },
    },
    sort: ['publishedAt:desc'],
    populate: {
      img: true,
    },
    pagination: {
      page: 1,
      pageSize,
    },
  };
  const queryString = qs.stringify(query, { encodeValuesOnly: true });

  return $get(`/master-templates?${queryString}`);
}
