import { $get, $put } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Template } from "@canva-web/src/models/template.model";

const VOTE_COOKIE_PREFIX = "template_vote_";
const VOTE_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    
    if (!documentId) {
      return NextResponse.json(
        { error: { message: 'Invalid template ID' } },
        { status: 400 }
      );
    }

    // Check if user has already voted using cookies
    const cookieStore = await cookies();
    const voteCookieName = `${VOTE_COOKIE_PREFIX}${documentId}`;
    const hasVoted = cookieStore.has(voteCookieName);

    if (hasVoted) {
      return NextResponse.json(
        { error: 'You have already voted for this template', alreadyVoted: true },
        { status: 429 }
      );
    }
    // Fetch current template data
    const templateResponse = await $get(`/master-templates/${documentId}`);
    if (templateResponse.error || !templateResponse.data) {
      return NextResponse.json(
        { error: { message: 'Template not found' } },
        { status: 404 }
      );
    }
    
    const template = templateResponse.data as Template;
    
    // Get current vote count from data field or initialize to 0
    const currentVoteCount = template.vote || 0;
    const newVoteCount = currentVoteCount + 1;
    const updateResponse = await $put(`/master-templates/${documentId}/vote-count`, {
      voteCount: newVoteCount,
    });

    if (updateResponse.error) {
      return NextResponse.json(
        { error: { message: 'Failed to update vote count' } },
        { status: 500 }
      );
    }

    // Set cookie to prevent duplicate votes (24 hours)
    const response = NextResponse.json({
      success: true,
      data: {
        voteCount: newVoteCount,
      }
    });

    response.cookies.set(voteCookieName, "1", {
      maxAge: VOTE_COOKIE_MAX_AGE,
      httpOnly: false, // Allow client-side reading for vote status check
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

