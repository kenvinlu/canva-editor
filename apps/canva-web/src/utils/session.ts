import { type SessionOptions } from "iron-session";
import { KEYS, secretCookiePassword, nodeEnv } from "./config";

export const sessionOptions: SessionOptions = {
  password: secretCookiePassword,
  cookieName: KEYS.AUTH_COOKIE_KEY,
  cookieOptions: {
    secure: nodeEnv === "production",
    httpOnly: true, // Prevent client-side JavaScript access
    sameSite: "lax", // Mitigate CSRF attacks
    path: "/", // Cookie available across the entire site
  },
};

export type SessionData = {
  user: string; // UserSaveInCookie;
  isDemo?: boolean;
  token?: string;
  temp?: any; // Confidential temp data, please delete after use.
}
