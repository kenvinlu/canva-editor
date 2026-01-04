import { $nextFetch, $nextPost, $nextPut, $nextUpload } from './base-request.service';
import {
  UserCreateModel,
  UserChangePasswordModel,
  UserModel,
  UserLoginResponse,
} from '@canva-web/src/models/user.model';

type ResponseType = {
  success: boolean;
  email: string;
  secret: string;
  url: string;
};

async function logUserIn(email: string, password?: string, totpCode?: string) {
  const body: { identifier: string; password?: string; totpCode?: string } = {
    identifier: email,
  };
  if (password) body.password = password;
  if (totpCode) body.totpCode = totpCode;
  return $nextPost<UserLoginResponse>(`/auth/local`, body);
}

async function verifyOtp(email: string, code: string, type: string) {
  return $nextPost<UserLoginResponse>(`/auth/verify-code`, { email, code, type });
}

async function generateTotpData() {
  return $nextPost<{ email: string; secret: string; url: string }>(
    `/auth/generate-totp-secret`
  );
}

async function saveTotpSecret(secret: string, code: string) {
  return $nextPost<ResponseType>(`/auth/save-totp-secret`, { secret, code });
}

async function enableTwoFactor(password: string, totpCode: string) {
  return $nextPost<ResponseType>(`/auth/enable-two-factor`, { password, totpCode });
}

async function disableTwoFactor(password: string) {
  return $nextPost<ResponseType>(`/auth/disable-two-factor`, { password });
}

async function validateTotp() {
  return $nextFetch<ResponseType>(
    `/auth/totp-enabled`
  );
}

async function enableOTP(password: string) {
  return $nextPost<ResponseType>(`/auth/enable-otp`, { password });
}

async function disableOTP(password: string) {
  return $nextPost<ResponseType>(`/auth/disable-otp`, { password });
}

async function userLogInProvider(provider: string | string[]) {
  return $nextFetch<UserLoginResponse>(`/auth/${provider}/callback${location.search}`);
}

async function userLogInGoogleOneTap(payload: UserCreateModel) {
  return $nextPost<UserLoginResponse>(`/auth/google-one-tap-callback`, payload);
}

async function forgotPassword(email: string) {
  return $nextPost<ResponseType>(`/auth/forgot-password`, { email });
}

async function changePassword(payload: UserChangePasswordModel) {
  return $nextPost<ResponseType>(`/auth/change-password`, payload);
}

async function resetPassword(code: string, password: string) {
  return $nextPost<ResponseType>(`/auth/reset-password`, {
    code,
    password,
    passwordConfirmation: password,
  });
}

async function createUser(payload: UserCreateModel) {
  return $nextPost<UserLoginResponse>(`/auth/local/register`, payload);
}

async function getCurrentUser() {
  return $nextFetch<UserModel>(`/users/me`, undefined, 0);
}

async function updateUserProfile(user: Partial<UserModel>) {
  return $nextPut<UserModel>(`/me`, user);
}

async function uploadAvatar(formData: FormData) {
  return $nextUpload(`/upload-avatar`, formData);
}

async function updateDiscoverFrom(selection: string) {
  return $nextPut<UserModel>(`/me`, { discoverFrom: selection });
}

async function updateUsername(username: string) {
  return $nextPut<UserModel>(`/me`, { username });
}

export {
  logUserIn,
  verifyOtp,
  validateTotp,
  generateTotpData,
  saveTotpSecret,
  enableTwoFactor,
  disableTwoFactor,
  enableOTP,
  disableOTP,
  userLogInProvider,
  getCurrentUser,
  uploadAvatar,
  updateUserProfile,
  updateUsername,
  updateDiscoverFrom,
  createUser,
  userLogInGoogleOneTap,
  forgotPassword,
  resetPassword,
  changePassword,
};
