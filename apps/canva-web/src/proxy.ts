import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { supportedLocales, defaultLocale } from './i18n/config';
import { generateNonce } from './utils/helpers';
import {
  IPrivateRoute,
  authenticatedRoutes,
  defaultRoute,
  unauthenticatedRoutes,
} from './core/guards/appRoutes';
import { getSession } from './core/actions/session';

const handleI18nRouting: (
  request: NextRequest
) => Promise<NextResponse | undefined> = (request: NextRequest) =>
  Promise.resolve(
    createIntlMiddleware({
      localePrefix: 'as-needed',
      defaultLocale,
      locales: supportedLocales,
      localeDetection: false, // Disable browser locale detection, always use defaultLocale
    })(request)
  );

export default async function middleware(request: NextRequest) {
  const { headers, nextUrl, url, method } = request;
  const queryString = nextUrl.searchParams?.toString();
  const query = queryString ? `?${queryString}` : '';
  const pathname = nextUrl?.pathname;

  headers.set('x-pathname', nextUrl.pathname);

  /**
   * CSP helps prevent XSS (Cross-Site Scripting) attacks by allowing only trusted scripts to execute.
   * A nonce allows inline scripts to run only if they match the dynamically generated nonce.
   */
  const response = await handleI18nRouting(request);
  const nonce = generateNonce();
  response?.headers.set('x-nonce', nonce);

  if (method === 'POST') {
    /**
     * POST Requests: React Client Components / Hydration / Data Fetching
     *   After the initial GET, you might see POST requests for the same URL, which could be due to:
     *   - Next.js Data Fetching (useEffect, useFetcher, or useSWR): Some client-side data-fetching hooks may send POST requests to revalidate data.
     *   - React Actions (Server Actions): If you're using Next.js Server Actions, it uses POST requests to send data to the server for processing.
     *   - Next.js App Router Streaming / RSC (React Server Components): When hydrating or updating components dynamically, Next.js may send POST requests to fetch partial updates.
     *   - Middleware or API Calls: Some internal API calls triggered by the page or middleware can also result in POST requests.
     */
    return response;
  }

  const { token } = await getSession();

  const isAuthenticatedRoute = authenticatedRoutes.find((r: IPrivateRoute) => {
    const { pathname: privatePathname } = r;
    return pathname.toLowerCase().includes(privatePathname.toLowerCase());
  });

  const isUnauthenticatedRoute = unauthenticatedRoutes.some((r) =>
    pathname.toLowerCase() === r.toLowerCase()
  );

  if (token) {
    // Prevent users from accessing routes if the user is logged in
    if (isUnauthenticatedRoute && pathname !== defaultRoute) {
      const redirectTo = nextUrl.searchParams.get('redirectTo');
      // console.log('redirectTo', new URL(redirectTo || defaultRoute, url), redirectTo, pathname);
      return NextResponse.redirect(new URL(redirectTo || defaultRoute, url));
    }
  } else {
    if (isAuthenticatedRoute) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirectTo=${encodeURIComponent(pathname)}${query}`, url)
      );
    }
  }

  return response;
}

// Specify the paths where the middleware should be applied
export const config = {
  matcher: [
    /**
     * It matches all paths except:
     * 1. /api/ (includes trpc there)
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (OG tags proxying)
     * 4. /_vercel (Vercel internals)
     * 5. /_static (inside of /public)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     * 7. The paths containing a file extension (e.g., .jpg, .png, etc.)
     */
    '/((?!api/|_next/|_proxy/|_vercel|_static|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};

