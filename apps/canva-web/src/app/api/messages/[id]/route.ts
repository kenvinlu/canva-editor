import { getSessionUser } from "@canva-web/src/core/actions/session";
import { Message } from "@canva-web/src/models/message.model";
import { $delete, $get, $put } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(
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

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Call Strapi API to delete message
    const result = await $delete<{ success: boolean; messageId: string }>(
      `/messages/${id}`
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Call Strapi API to update message
    const result = await $put<{ success: boolean; messageId: string }>(
      `/messages/${id}`,
      body
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
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
    const result = await $get<{ data: Message }>(`/messages/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}