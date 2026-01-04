import { updateSession } from "@canva-web/src/core/actions/session";
import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await doRequest(body);

    if (!result?.jwt || !result?.user) {
      return Response.json({
        data: false
      });
    }

    updateSession({
      token: result.data?.jwt,
      user: result.data?.user,
    });
    return Response.json({
      data: true
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(body: { currentPassword: string; password: string; passwordConfirmation: string }): Promise<any> {
  return $post(`/auth/change-password`, body);
}
