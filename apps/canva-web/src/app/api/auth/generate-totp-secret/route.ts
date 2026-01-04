import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const result = await doRequest();
    return Response.json(result);
  } catch (error) {
    console.error('Generate TOTP secret error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(): Promise<any> {
  return $post(`/auth/generate-totp-secret`);
}
