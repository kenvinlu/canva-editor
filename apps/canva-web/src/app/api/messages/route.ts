import { getSessionUser } from "@canva-web/src/core/actions/session";
import type { MessageListResponse } from "@canva-web/src/models/message.model";
import { $get } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const status = searchParams.get('status');

    // Build query string for Strapi API
    // Strapi will filter by authenticated user automatically (ctx.state.user)
    const params = new URLSearchParams({
      page,
      pageSize,
    });

    if (status) {
      params.append('status', status);
    }

    // Call Strapi API
    const result = await $get<MessageListResponse>(
      `/messages?${params.toString()}`,
      undefined,
      0 // No cache
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
