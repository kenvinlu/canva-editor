import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await doRequest();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(): Promise<any> {
  return $get(`/configuration`, undefined, 0);
}

