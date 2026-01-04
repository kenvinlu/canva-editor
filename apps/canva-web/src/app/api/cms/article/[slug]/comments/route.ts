import { getSessionUser } from "@canva-web/src/core/actions/session";
import type { Comment } from "@canva-web/src/models/cms.model";
import { $get as $getStrapi, $post } from "@canva-web/src/services/base-request.service";
import { NextResponse, type NextRequest } from "next/server";

interface CommentListResponse {
  data: Comment[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // First, fetch the article to get the documentId
    // The slug in URL is the article slug, but we need documentId for Strapi relation
    interface ArticleResponse {
      data?: {
        data?: {
          id: number;
          documentId?: string;
          [key: string]: unknown;
        };
        id?: number;
        documentId?: string;
        [key: string]: unknown;
      };
      error?: unknown;
    }
    
    const articleResponse = await $getStrapi<ArticleResponse>(`/article/${slug}?locale=${locale}`);
    if (articleResponse.error || !articleResponse.data) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const articleData = (articleResponse.data as { data?: { documentId?: string | number; id: number | string } }).data || articleResponse.data;
    const documentId = (articleData as { documentId?: string | number; id?: number | string }).documentId || (articleData as { id?: number | string }).id;
    
    if (!documentId) {
      console.error('No documentId found in article response (GET):', articleResponse.data);
      return NextResponse.json(
        { error: 'Article documentId not found' },
        { status: 400 }
      );
    }
    
    // Ensure documentId is a string for the relation
    const documentIdStr = String(documentId);
    const relation = `api::article.article:${documentIdStr}`;
    
    const searchParamsObj = req.nextUrl.searchParams;
    const hierarchical = searchParamsObj.get('hierarchical') === 'true';
    
    const endpoint = `/comments/${relation}${hierarchical ? '' : '/flat'}`;

    // Call Strapi Comments API to get comments for this article
    const result = await $getStrapi<CommentListResponse>(
      endpoint,
      undefined,
      0 // No cache
    );

    if (result.error) {
      console.error('Strapi Comments API error:', result.error);
      throw new Error(result.error.message || 'Failed to fetch comments');
    }

    // Return comments in the expected format
    // The API returns data directly, not wrapped in { data: ... }
    const comments = Array.isArray(result.data) ? result.data : result.data?.data || [];
    return NextResponse.json({
      data: comments,
      meta: result.data?.meta,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';
    const body = await req.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // First, fetch the article to get the documentId
    // The slug in URL is the article slug, but we need documentId for Strapi relation
    interface ArticleResponse {
      data?: {
        data?: {
          id: number;
          documentId?: string;
          [key: string]: unknown;
        };
        id?: number;
        documentId?: string;
        [key: string]: unknown;
      };
      error?: unknown;
    }
    
    const articleResponse = await $getStrapi<ArticleResponse>(`/article/${slug}?locale=${locale}`);
    if (articleResponse.error || !articleResponse.data) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Handle both nested { data: { data: ... } } and direct { data: ... } structures
    const articleData = (articleResponse.data as { data?: { documentId?: string | number; id: number | string } }).data || articleResponse.data;
    
    // Log the article response for debugging
    console.log('Article response data (POST):', JSON.stringify(articleResponse.data, null, 2));
    console.log('Article data extracted (POST):', JSON.stringify(articleData, null, 2));
    
    // Use documentId if available, otherwise use the Strapi document id
    // In Strapi v5, documentId is a string like "bew6d3y66i9o3zt5649t96w9"
    const documentId = (articleData as { documentId?: string | number; id?: number | string }).documentId || (articleData as { id?: number | string }).id;
    
    if (!documentId) {
      console.error('No documentId found in article response (POST):', articleResponse.data);
      return NextResponse.json(
        { error: 'Article documentId not found' },
        { status: 400 }
      );
    }
    
    // Ensure documentId is a string for the relation
    const documentIdStr = String(documentId);
    const relation = `api::article.article:${documentIdStr}`;
    
    console.log('Using relation (POST):', relation);

    // Construct author name from user data
    const authorName = 
      (user.firstName && user.lastName) 
        ? `${user.firstName} ${user.lastName}` 
        : user.username || user.email || 'User';

    // According to Strapi Comments plugin docs:
    // POST /api/comments/api::<collection>.<content-type>:<id>
    // Request body: { content: string, author: { id: string, name: string } }
    // For replies, include threadOf as the comment ID (number)
    const commentData: {
      content: string;
      author: { id: string; name: string; email?: string };
      threadOf?: number;
    } = {
      content: body.content.trim(),
      author: {
        id: user.id.toString(),
        name: authorName,
        email: user.email,
      },
    };

    // If this is a reply to another comment, include threadOf as the comment ID
    if (body.threadOf) {
      const threadOfId = typeof body.threadOf === 'string' 
        ? parseInt(body.threadOf, 10) 
        : body.threadOf;
      if (!isNaN(threadOfId) && threadOfId > 0) {
        commentData.threadOf = threadOfId;
        console.log('Adding threadOf:', threadOfId);
      } else {
        console.warn('Invalid threadOf value:', body.threadOf);
      }
    }

    // Call Strapi Comments API to create comment
    // Endpoint format: POST /api/comments/api::<collection>.<content-type>:<id>
    // Note: apiUrl already includes /api, so we use /comments/ not /api/comments/
    // The relation in the path should NOT be URL-encoded - Strapi handles it
    const endpoint = `/comments/${relation}`;
    
    console.log('Creating comment with:', {
      endpoint,
      relation,
      articleSlug: slug,
      documentId: documentId,
      commentData,
    });
    
    const result = await $post<Comment>(
      endpoint,
      commentData
    );

    if (result.error) {
      console.error('Strapi Comments API error:', result.error);
      console.error('Full error details:', JSON.stringify(result.error, null, 2));
      const errorMessage = result.error.message || 'Failed to create comment';
      const errorDetails = result.error.detail;
      console.error('Error details:', errorDetails);
      throw new Error(errorMessage);
    }
    // The API returns the comment directly, not wrapped in { data: ... }
    if (!result) {
      throw new Error('Comment was created but no data returned');
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

