import { getSessionUser } from "@canva-web/src/core/actions/session";
import type { Message, SendReplyRequest } from "@canva-web/src/models/message.model";
import { $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: { content: string } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }

    // Call Strapi API to add reply
    const result = await $post<{ success: boolean; data: Message }>(
      `/messages/${id}/reply`,
      {
        content: body.content.trim(),
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Return the message data in a consistent format
    if (result.data) {
      return NextResponse.json({ 
        success: true, 
        data: result.data 
      });
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Send reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

