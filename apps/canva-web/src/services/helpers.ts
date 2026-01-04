export const forwardRequestHeaders = async (headers: Record<string, string | number | boolean> = {}) => {
  // Get cookies from the browser for client-side requests
  const cookies = typeof document !== 'undefined' ? document.cookie : '';
  
  return {
    ...headers,
    "Content-Type": "application/json",
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    ...(cookies && { 'Cookie': cookies }),
  };
};
