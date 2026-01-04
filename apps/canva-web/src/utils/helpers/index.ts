import type { NextRequest } from "next/server";
import { unpack } from "../minifier";
import { apiUrl } from "../config";
import { USER_MAPPING } from "../minifier/mapping";
import { UserModel } from "@canva-web/src/models/user.model";

const getApiUrl = () => {
  if (checkServer()) {
    return apiUrl;
  }
  return window.location.origin;
};

const getSearchParams = (searchParams: any) => {
  const params = {} as Record<string, string>;
  if (searchParams) {
    searchParams.forEach(function (val: any, key: any) {
      params[key] = val;
    });
  }
  return params;
};

const getSearchParamsByReq = (req: NextRequest) => {
  if (!req) {
    return {};
  }
  return getSearchParams(req.nextUrl?.searchParams);
};

const unpackUserProfile = (user: string): UserModel => {
  return user ? unpack(JSON.parse(user), USER_MAPPING) : null;
};

const generateNonce = () => {
  // Generate a cryptographically secure nonce using Web Crypto API
  const nonceArray = new Uint8Array(16);
  globalThis.crypto.getRandomValues(nonceArray);
  const nonce = Buffer.from(nonceArray).toString("base64");
  return nonce;
};


// https://github.com/iliakan/detect-node
const checkServer = () => typeof window === "undefined";
// Object.prototype.toString.call(global.process) === "[object process]";

function isLocalhost() {
  if (checkServer()) {
    return false;
  }
  const domainName = window.location.host;
  const port = window.location.port;

  return domainName.includes("localhost") || domainName.includes("127.0.0.1") || port === "3000";
}
const consoleWarningMessage = () => {
  if (isLocalhost()) {
    return;
  }

  // Logo
  console.log("%cWarning", ["font-size: 30px", "color: red", "font-weight: bold"].join(";"));

  const msg = "%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS. Do not enter or paste code that you do not understand.",
    styles = [
      "font-size: 12px",
      "font-family: monospace",
      "background: white",
      "display: inline-block",
      "color: black",
      "padding: 8px 19px",
      "border: 1px dashed",
    ].join(";");
  console.log(msg, styles);
};

export {
  getApiUrl,
  checkServer,
  getSearchParams,
  getSearchParamsByReq,
  unpackUserProfile,
  isLocalhost,
  consoleWarningMessage,
  generateNonce,
};
