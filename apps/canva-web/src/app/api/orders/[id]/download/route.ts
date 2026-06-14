import { getSessionUser } from "@canva-web/src/core/actions/session";
import { apiUrl } from "@canva-web/src/utils/config";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionData } from "@canva-web/src/core/actions/session";
import { KEYS } from "@canva-web/src/utils/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check authentication
    const user = await getSessionUser();

    if (!user) {
      // 2. If not authenticated, redirect to login with return URL
      const { id } = await params;
      const downloadUrl = `/api/orders/${id}/download`;
      const signInUrl = `/sign-in?redirectTo=${encodeURIComponent(downloadUrl)}`;
      return NextResponse.redirect(new URL(signInUrl, req.url));
    }

    // 3. Get order ID from params
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // 4. Get session token for Strapi API
    const { token } = await getSessionData();
    if (!token) {
      return NextResponse.json(
        { error: "Authentication token not found" },
        { status: 401 }
      );
    }

    // 5. Call Strapi download endpoint which will redirect to the file
    const strapiUrl = `${apiUrl}/orders/${id}/download`;
    
    // Check if Strapi returns a redirect (without following it)
    const response = await fetch(strapiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "manual", // Don't follow redirects automatically
    });

    // 6. If Strapi returns a redirect (3xx status), redirect the user to that URL
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        return NextResponse.redirect(location);
      }
    }

    // 7. If there's an error, return it
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to download file" },
        { status: response.status }
      );
    }

    // 8. If it's a direct file response (shouldn't happen with current Strapi implementation, but handle it)
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition");
    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        ...(contentDisposition && { "Content-Disposition": contentDisposition }),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

