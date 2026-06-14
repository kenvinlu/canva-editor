import { NextResponse, type NextRequest } from "next/server";
import docsData from "@canva-web/src/data/docs.json";
import type { DocsData } from "@canva-web/src/types/docs";

const mockDocs = docsData as DocsData;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('kw')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('pi') || '1');
    const limit = parseInt(searchParams.get('ps') || '10');

    // Search in title, description, and content
    const searchResults = mockDocs.filter(doc => {
      if (!keyword) return true;

      return (
        doc.title.toLowerCase().includes(keyword) ||
        doc.description.toLowerCase().includes(keyword) ||
        doc.content.toLowerCase().includes(keyword) ||
        doc.category.toLowerCase().includes(keyword)
      );
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = searchResults.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedDocs,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          pageCount: Math.ceil(searchResults.length / limit),
          total: searchResults.length,
        },
      },
    });
  } catch (error) {
    console.error('Search docs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
