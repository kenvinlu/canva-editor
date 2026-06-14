import { $post } from "@canva-web/src/services/base-request.service";
import FETCH_TAGS from "@canva-web/src/utils/fetchTags";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId } = body;
    
    // templateId is now optional - if not provided, create empty project
    const result = await doRequest(templateId);
    // Revalidate cache tag first
    revalidateTag(FETCH_TAGS.PROJECT_LIST, 'max');
    // Revalidate API route (without query params - Next.js will handle all variations)
    revalidatePath('/api/projects/my-projects', 'page');
    // Revalidate all locale variations of the projects page
    revalidatePath('/projects', 'page');
    revalidatePath('/en/projects', 'page');
    revalidatePath('/vi/projects', 'page');
    return Response.json(result);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function doRequest(templateId?: number): Promise<any> {
  return $post('/projects/create', templateId ? { templateId } : {});
}
