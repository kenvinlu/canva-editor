'use client';

import { useEffect } from 'react';
import {
  IUseGoogleOneTapLogin,
  IGoogleCallbackResponse,
  IGoogleEndPointResponse,
} from './types';
import useScript from './useScript';

const scriptFlag = '__googleOneTapScript__';
const googleClientScriptURL = 'https://accounts.google.com/gsi/client';
const oauthEndpointURL = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

function callback({
  data,
  onError,
  onSuccess,
}: {
  data: IGoogleCallbackResponse;
  onError?: IUseGoogleOneTapLogin['onError'];
  onSuccess?: IUseGoogleOneTapLogin['onSuccess'];
}) {
  if (data?.credential) {
    fetch(`${oauthEndpointURL}${data.credential}`)
      .then((resp) => {
        if (resp?.status === 200 && resp?.json) {
          return resp.json();
        } else {
          if (onError) {
            onError();
          }
          throw new Error('Something went wrong');
        }
      })
      .then((resp: IGoogleEndPointResponse) => {
        if (onSuccess) {
          onSuccess(resp);
        }
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        }
        throw error;
      });
  }
}

export function useGoogleOneTapLogin({
  onError,
  disabled,
  onSuccess,
  googleAccountConfigs,
  disableCancelOnUnmount = false,
}: IUseGoogleOneTapLogin) {
  const script = useScript(googleClientScriptURL);
  // Use the user's custom callback if they specified one; otherwise use the default one defined above:
  const callbackToUse = googleAccountConfigs.callback
    ? googleAccountConfigs.callback
    : (data: IGoogleCallbackResponse) => callback({ data, onError, onSuccess });

  useEffect(() => {
    if (!window?.[scriptFlag] && window.google && script === 'ready') {
      window.google.accounts.id.initialize({
        ...googleAccountConfigs,
        callback: callbackToUse,
        prompt_moment_notification: (notification: any) => {
          if (notification.isDismissedMoment()) {
            console.log('One Tap prompt dismissed:', notification.getDismissedReason());
            // Optionally call onError with a custom message
            if (onError) {
              onError(new Error('User dismissed the One Tap prompt'));
            }
          } else if (notification.isDisplayed()) {
            console.log('One Tap prompt displayed');
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap prompt skipped:', notification.getSkippedReason());
          }
        },
      });
      window[scriptFlag] = true;
    }
    if (window?.[scriptFlag] && script === 'ready' && !disabled) {
      window.google.accounts.id.prompt();
      return () => {
        if (!disableCancelOnUnmount) {
          window.google.accounts.id.cancel();
        }
      };
    }
  }, [script, disabled]);

  return null;
}
