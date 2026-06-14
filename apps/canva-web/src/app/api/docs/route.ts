import { NextResponse, type NextRequest } from "next/server";
import docsData from "@canva-web/src/data/docs.json";
import type { DocsData } from "@canva-web/src/types/docs";

const mockDocs = docsData as DocsData;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('pi') || '1');
    const limit = parseInt(searchParams.get('ps') || '10');
    const category = searchParams.get('category') || '';

    let filteredDocs = [...mockDocs];

    // Filter by category if provided
    if (category) {
      filteredDocs = filteredDocs.filter(doc => doc.category === category);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedDocs,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          pageCount: Math.ceil(filteredDocs.length / limit),
          total: filteredDocs.length,
        },
      },
    });
  } catch (error) {
    console.error('Fetch docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
