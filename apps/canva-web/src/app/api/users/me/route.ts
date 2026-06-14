import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await doRequest();
    if (!result || result.error) {
      return NextResponse.json(null, {
        status: 401,
      });
    }
    return Response.json(result);
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(): Promise<any> {
  return $get(`/users/me`, undefined, 0);
}
