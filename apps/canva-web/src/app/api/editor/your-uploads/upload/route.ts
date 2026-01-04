import { $upload } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await doRequest(formData);
    return Response.json(result);
  } catch (error) {
    console.error('Upload user image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(formData: FormData): Promise<any> {
  return $upload(`/your-uploads/upload`, formData);
}

