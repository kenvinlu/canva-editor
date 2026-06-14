import { $delete } from "@canva-web/src/services/base-request.service";
import type { BaseResponseModel } from "@canva-web/src/models/base.model";
import FETCH_TAGS from "@canva-web/src/utils/fetchTags";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const result = await doRequest(id);
    // Revalidate cache tag first
    revalidateTag(FETCH_TAGS.PROJECT_LIST, 'max');
    return Response.json(result);
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(documentId: string): Promise<BaseResponseModel<boolean>> {
  return $delete(`/projects/${documentId}`);
}

