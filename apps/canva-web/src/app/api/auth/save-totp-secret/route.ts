import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await doRequest(body);
    return Response.json(result);
  } catch (error) {
    console.error('Save TOTP secret error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(body: { secret: string; code: string }): Promise<any> {
  return $post(`/auth/save-totp-secret`, body);
}
