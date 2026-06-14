import { NextResponse } from "next/server";
import docsData from "@canva-web/src/data/docs.json";
import type { DocsData } from "@canva-web/src/types/docs";

const mockDocs = docsData as DocsData;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const doc = mockDocs.find(d => d.slug === slug);

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: doc });
  } catch (error) {
    console.error('Fetch doc error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
