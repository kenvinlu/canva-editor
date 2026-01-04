import Link from "next/link";

/**
 * Root-level not-found page for Next.js
 * This handles the /_not-found route that Next.js prerenders during build
 * It doesn't have access to the locale layout, so we use a simple static page
 */
export const dynamic = 'force-dynamic';

export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <title>Page Not Found</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '40px', fontWeight: 600, margin: '0 0 16px 0', color: '#121212' }}>
            Page not found
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 300, margin: '0 0 32px 0', color: '#121212' }}>
            The page you are looking for does not exist.
          </p>
          <Link href="/" title="Go to home page"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '9999px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
            }}>
            Go to home page
          </Link>
        </div>
      </body>
    </html>
  );
}

