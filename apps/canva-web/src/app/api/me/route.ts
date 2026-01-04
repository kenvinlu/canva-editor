import { $put } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@canva-web/src/core/actions/session";

type UpdateMeRequestBody = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

export async function PUT(req: NextRequest) {
  try {
    const body: UpdateMeRequestBody = await req.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Whitelist fields that can be updated from the profile screen
    const payload: UpdateMeRequestBody = {};
    if (typeof body.firstName === 'string') payload.firstName = body.firstName;
    if (typeof body.lastName === 'string') payload.lastName = body.lastName;
    if (typeof body.phone === 'string') payload.phone = body.phone;
    if (typeof body.email === 'string') payload.email = body.email;

    const result = await doRequest(sessionUser.id, payload);
    return Response.json({
      data: result,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(userId: number, body: UpdateMeRequestBody): Promise<unknown> {
  return $put(`/users/${userId}`, body);
}
