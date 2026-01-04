'use client';

import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  userLogInGoogleOneTap,
} from '../services/auth.service';
import { useUserStore } from '../store/useUserStore';
import {
  getSessionData,
  signOut,
  updateSession,
} from '../core/actions/session';
import { IGoogleEndPointResponse } from '../components/google-one-tap/types';
import GoogleOneTapLogin from '../components/google-one-tap';
import { UserModel } from '../models/user.model';
import { useRouter } from 'next/navigation';
import { googleOneTapClientId } from '../utils/config';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useUserStore((state) => state.setUser);
  const doLogout = useUserStore((state) => state.logout);
  const router = useRouter();
  const [enableGoogleOneTap, setEnableGoogleOneTap] = useState(false);
  const handleGoogleOneTapCallback = async (
    response: IGoogleEndPointResponse
  ) => {
    try {
      const {
        email,
        given_name: firstName,
        family_name: lastName,
        picture: avatar,
      } = response;
      const loginResult = await userLogInGoogleOneTap({
        firstName,
        lastName,
        email,
        username: email,
        avatar,
      });

      if (loginResult.data) {
        updateSession({
          token: loginResult.data.jwt,
          user: loginResult.data.user,
        });
        setEnableGoogleOneTap(false);
        setUser(loginResult.data?.user as UserModel);
      } else {
        throw new Error('Login failed');
      }
      router.refresh();
    } catch (err) {
      console.log('error', err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { token } = await getSessionData();
        if (!token) {
          setEnableGoogleOneTap(true);
          doLogout();
          return;
        }

        const userData = await getCurrentUser();

        if (userData) {
          setUser(userData as UserModel);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error getting session data', error);
        setEnableGoogleOneTap(true);
        doLogout();
        await signOut();
      }
    };
    getUser();
  }, []);

  return (
    <>
      {enableGoogleOneTap && (
        <GoogleOneTapLogin
          onError={(error) => {
            console.log('Google One Tap Error', error);
          }}
          onSuccess={handleGoogleOneTapCallback}
          googleAccountConfigs={{
            prompt_parent_id: 'g_id_onload',
            client_id: googleOneTapClientId,
          }}
        />
      )}
      {children}
    </>
  );
}
