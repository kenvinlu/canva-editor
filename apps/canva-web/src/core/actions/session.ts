"use server";

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies as NextCookies } from "next/headers";
import type { IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import type { SessionData } from "@canva-web/src/utils/session";
import { sessionOptions } from "@canva-web/src/utils/session";
import { USER_MAPPING } from "@canva-web/src/utils/minifier/mapping";
import { pack, unpack } from "@canva-web/src/utils/minifier";
import { UserModel } from "@canva-web/src/models/user.model";

export const getCookie = async (name: string, cookies = NextCookies) => {
  const cookieStore = await cookies();
  const cookieData = cookieStore.get(name);
  return cookieData?.value;
};

export const getSession = async (cookieStore?: ReadonlyRequestCookies): Promise<IronSession<SessionData>> => {
  if (!cookieStore) {
    cookieStore = await NextCookies();
  }
  return await getIronSession<SessionData>(cookieStore, sessionOptions);
};

export const getSessionData = async () => {
  const session = await getSession();
  const user = session?.user ? unpack(JSON.parse(session?.user), USER_MAPPING) : null;
  return { ...session, user };
};

export const getSessionUser = async (): Promise<UserModel | null> => {
  const session = await getSession();
  return session?.user ? unpack(JSON.parse(session?.user), USER_MAPPING) : null;
};

export const updateSession = async ({
  token,
  user, 
  isDemo,
}: {
  token?: string;
  user?: UserModel;
  isDemo?: boolean;
}) => {
  if (!token || !user) {
    return;
  }

  // Update session token
  const session = await getSession();
  const userPacked = pack(user, USER_MAPPING);
  
  session.token = token;
  session.user = JSON.stringify(userPacked[0]);
  
  if (isDemo) {
    session.isDemo = true;
  }
  await session.save();
};

/**
 * Sign out the user
 */
export const signOut = async () => {
  const session = await getSession();
  session.destroy();
  return true;
};

/**
 * Store temp data (short-lived) in session to transfer data from client to server.
 * @param obj
 * @returns
 */
export const saveSessionTempSecureData = async (obj: any) => {
  try {
    const session = await getSession();
    if (!obj) {
      return;
    }
    session.temp = obj;
    await session.save();
  } catch (e) {
    console.log("Save the temp secure data failed.", e);
  }
};

export const removeSessionTempSecureData = async () => {
  try {
    const session = await getSession();
    delete session.temp;
    await session.save();
  } catch (e) {
    console.log("Remove the temp secure data failed.", e);
  }
};
