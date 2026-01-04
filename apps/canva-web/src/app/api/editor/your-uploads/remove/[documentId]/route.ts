import { $delete } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const result = await doRequest(documentId);
    return Response.json(result);
  } catch (error) {
    console.error('Remove user image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(documentId: string): Promise<any> {
  return $delete(`/your-uploads/remove/${documentId}`);
}

