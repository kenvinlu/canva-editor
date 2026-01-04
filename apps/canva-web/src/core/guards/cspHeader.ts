import { nodeEnv } from "@canva-web/src/utils/config";

// const externalDomains = ["unpkg.com", "*.stripe.com", "*.amazonaws.com"];
const getInternalDomains = function (hostname: string) {
  const domains = [hostname];

  if (nodeEnv === "development") {
    domains.push("localhost:3000");
    domains.push("localhost:4200");
  }

  return domains;
};

/**
 * Generates a Content Security Policy (CSP) header.
 *
 * - `script-src` allows scripts with the provided nonce, dynamically loaded scripts, and StencilJS execution.
 * - `script-src-elem` explicitly allows scripts with the nonce (important for StencilJS).
 * - `unsafe-eval` is included to support Next.js and StencilJS (remove if possible in production).
 * - `connect-src` allows StencilJS to fetch required resources.
 * - `frame-ancestors` retains domain restrictions.
 * - `frame-src` Be mindful that allowing blob: in frame-src could have security implications depending on your use case.
 *    It's generally safe if you're controlling the blob: URLs and know their contents. 
 *    However, you should be careful about allowing potentially untrusted sources to be loaded as blob: URLs.
 *
 * @param nonce Nonce to allow scripts securely.
 * @returns A properly formatted CSP string.
 */
// TODO: Temporary to disable the nonce security check.
// script-src 'nonce-${nonce}' 'unsafe-eval' 'self';
// script-src-elem 'nonce-${nonce}' 'self' ${[...getInternalDomains(), ...googleDomains, ...externalDomains].join(" ")};
// frame-src 'self' ${[...getInternalDomains()].join(" ")} blob:;
export default function getCSPHeader(hostname: string, nonce: string) {
  return `
      frame-ancestors 'self' ${[...getInternalDomains(hostname)].join(" ")};
    `
    .replace(/\s{2,}/g, " ")
    .trim();
}
