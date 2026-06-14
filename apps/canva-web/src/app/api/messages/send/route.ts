import { getSessionUser } from "@canva-web/src/core/actions/session";
import type { Message, SendMessageRequest } from "@canva-web/src/models/message.model";
import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: SendMessageRequest = await req.json();

    if (!body.subject || !body.content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Call Strapi API to create message
    // Strapi will get user info from authenticated context (ctx.state.user)
    const result = await $post<{ success: boolean; message: Message }>(
      '/messages',
      {
        subject: body.subject,
        content: body.content,
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
