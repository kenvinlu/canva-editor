import { ReactElement } from 'react';

declare global {
  interface Window {
    google: any;
    [key: string]: any;
  }
}

export interface IGoogleOneTapLogin extends IUseGoogleOneTapLogin {
  children?: ReactElement | null;
}

export interface IUseGoogleOneTapLogin {
  disabled?: boolean;
  disableCancelOnUnmount?: boolean;
  onError?: (error?: Error | string) => void;
  googleAccountConfigs: IGoogleOneTapLoginProps;
  onSuccess?: (response: IGoogleEndPointResponse) => void;
}

export interface IGoogleOneTapLoginProps {
  nonce?: string;
  context?: string;
  client_id: string;
  auto_select?: boolean;
  prompt_parent_id?: string;
  state_cookie_domain?: string;
  cancel_on_tap_outside?: boolean;
  callback?: (...args: any) => any;
  native_callback?: (...args: any) => any;
}

export interface IGoogleCallbackResponse {
  credential?: string;
}

export interface IGoogleEndPointResponse {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;
  name: string;
  email: string;
  local: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: string;
}
