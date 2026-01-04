// import { getNodeEnv } from "@/config/Env";

import { getCookie, getSessionData } from "@canva-web/src/core/actions/session";
import { KEYS, nextApiUrl, apiUrl } from "@canva-web/src/utils/config";
import type { BaseResponseModel } from "@canva-web/src/models/base.model";
import { forwardRequestHeaders } from "@canva-web/src/services/helpers";

type RequestOptions = {
  method: string;
  body?: unknown;
  headers?: Record<string, string | number | boolean>;
  revalidate?: number;
};

const baseRequest = async <T>(url: string, options: RequestOptions): Promise<BaseResponseModel<T>> => {
  const { method, body, headers = {}, revalidate } = options;
  
  const nextOptions: NextFetchRequestConfig = {
    revalidate: method === 'GET' ? 10 : undefined, // 10 seconds for GET requests
  };
  if (revalidate !== undefined) {
    // Custom revalidate
    nextOptions.revalidate = revalidate;
  }
  
  try {
    // const start = Date.now();
    const res = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      next: { ...nextOptions },
      cache: nextOptions.revalidate ? 'force-cache' : 'no-store'
    });

    // const end = Date.now();
    const result: BaseResponseModel<T> = await res.json();

    // Log slow requests in development
    // if (getNodeEnv() === "development" && !isProxy) {
    //   const responseTimeValid = 3e3,
    //     responseTime = end - start,
    //     logColor = responseTime > responseTimeValid ? "\x1b[33m%s\x1b[0m" : "\x1b[32m%s\x1b[0m";
    //   if (responseTime > responseTimeValid) {
    //     console.log(logColor, `${method} ${url} in ${(end - start) / 1e3}s`);
    //   }
    // }

    if (res.ok) {
      return result;
    }

    console.warn("\x1b[31m", `${method} ${url} failed!`);
    return result;
  } catch (error: unknown) {
    // console.log('API Error:', url);
    // console.log('API Error:', headers);
    // console.log('Error', error);
    return {
      error: {
        detail: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Error',
        status: (error as { status?: number })?.status || 500,
      },
    };
  }
};

async function serverRequest<T>(url: string, options: RequestOptions): Promise<BaseResponseModel<T>> {
  const { headers = {} } = options;
  const { token: userToken } = await getSessionData();
  const serverHeaders: Record<string, string | number> = await forwardRequestHeaders(headers);

  if (userToken) {
    serverHeaders[KEYS.AUTH_HEADER_TOKEN_KEY] = `Bearer ${userToken}`;
  }

  return baseRequest<T>(url, {...options, headers: serverHeaders});
}

async function nextRequest<T>(url: string, options: RequestOptions): Promise<BaseResponseModel<T>> {
  const { headers = {} } = options;
  // Prepare headers for client-side proxy requests
  const proxyHeaders: Record<string, string | number> = await forwardRequestHeaders(headers);
  return baseRequest<T>(url, { ...options, headers: proxyHeaders });
}

const $get = async <T>(url: string, headers?: Record<string, string | number>, revalidate?: number) => serverRequest<T>(apiUrl + url, { method: "GET", headers, revalidate });
const $post = async <T>(url: string, body?: unknown, headers?: Record<string, string | number | boolean>) => serverRequest<T>(apiUrl + url, { method: "POST", body, headers });
const $put = async <T>(url: string, body?: unknown, headers?: Record<string, string | number | boolean>) => serverRequest<T>(apiUrl + url, { method: "PUT", body, headers });
const $delete = async <T>(url: string, body?: unknown, headers?: Record<string, string | number | boolean>) =>
  serverRequest<T>(apiUrl + url, { method: "DELETE", body, headers });

const $upload = async <T>(url: string, formData: FormData) => {
  const headers: Record<string, string> = {};

  const token = await getCookie(KEYS.AUTH_COOKIE_KEY);

  if (token) {
    headers[KEYS.AUTH_HEADER_TOKEN_KEY] = `Bearer ${token}`;
  }

  return baseRequest<T>(apiUrl + url, { method: "POST", body: formData, headers });
};

const $nextFetch = async <T>(url: string, headers?: Record<string, string | number>, revalidate?: number) => nextRequest<T>(nextApiUrl + url, { method: "GET", headers, revalidate });
const $nextPost = async <T>(url: string, body?: unknown, headers?: Record<string, string | number>, revalidate?: number) => nextRequest<T>(nextApiUrl + url, { method: "POST", body, headers, revalidate });
const $nextPatch = async <T>(url: string, body?: unknown, headers?: Record<string, string | number>, revalidate?: number) => nextRequest<T>(nextApiUrl + url, { method: "PATCH", body, headers, revalidate });
const $nextPut = async <T>(url: string, body?: unknown, headers?: Record<string, string | number>, revalidate?: number) => nextRequest<T>(nextApiUrl + url, { method: "PUT", body, headers, revalidate });
const $nextDelete = async <T>(url: string, body?: unknown, headers?: Record<string, string | number>, revalidate?: number) =>
  nextRequest<T>(nextApiUrl + url, { method: "DELETE", body, headers });

const $nextUpload = async <T>(url: string, formData: FormData) => {
  const headers: Record<string, string> = {};

  const token = await getCookie(KEYS.AUTH_COOKIE_KEY);

  if (token) {
    headers[KEYS.AUTH_HEADER_TOKEN_KEY] = `Bearer ${token}`;
  }

  return nextRequest<T>(nextApiUrl + url, { method: "POST", body: formData, headers });
};

export { 
  $delete, $get, $post, $put, $upload,
  $nextFetch, $nextPost, $nextPatch, $nextPut, $nextDelete, $nextUpload,
};
