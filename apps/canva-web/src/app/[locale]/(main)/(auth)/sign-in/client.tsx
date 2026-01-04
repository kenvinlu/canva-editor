'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { Separator } from '@canva-web/src/components/base/separator/Separator';
import { Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { logUserIn, verifyOtp } from '@canva-web/src/services/auth.service';
import { updateSession } from '@canva-web/src/core/actions/session';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { FETCH_CURRENT_USER_LOADING } from '@canva-web/src/store/useCommonStore';
import { useCommonStore } from '@canva-web/src/store/useCommonStore';
import GoogleIcon from '@canva-web/src/components/icons/GoogleIcon';
import GithubIcon from '@canva-web/src/components/icons/GithubIcon';
import { UserModel } from '@canva-web/src/models/user.model';
import { defaultRoute } from '@canva-web/src/core/guards/appRoutes';

export function SignInPageClient() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const addLoading = useCommonStore((state) => state.addLoading);
  const removeLoading = useCommonStore((state) => state.removeLoading);
  const loading = useCommonStore((state) =>
    state.isLoading(FETCH_CURRENT_USER_LOADING)
  );
  const t = useTranslations();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [error, setError] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState<{
    email: string;
    verifyType: string;
    message: string;
  } | null>(null); // Store 2FA details
  const [twoFactorCode, setTwoFactorCode] = useState(''); // Store TOTP/OTP code

  const handleFormSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    setError('');
    addLoading(FETCH_CURRENT_USER_LOADING);

    try {
      const loginResult = await logUserIn(values.email, values.password);

      if (loginResult.error) {
        setError(loginResult.error.message || 'auth.apiMessages.loginFailed');
        return;
      }

      if (loginResult.data?.verifyType) {
        // 2FA required
        setTwoFactorRequired({
          email: loginResult.data.email,
          verifyType: loginResult.data.verifyType,
          message: loginResult.data.message,
        });
      } else {
        // No 2FA, proceed with login
        updateSession({
          token: loginResult.data?.jwt,
          user: loginResult.data?.user,
        });
        setUser(loginResult.data?.user as UserModel);
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirectTo') || defaultRoute;
        router.push(redirectTo);
      }
    } catch (err) {
      setError('auth.apiMessages.loginFailed');
      console.error(err);
    } finally {
      removeLoading(FETCH_CURRENT_USER_LOADING);
    }
  };

  const handleTwoFactorSubmit = async () => {
    if (!twoFactorRequired) return;

    setError('');
    addLoading(FETCH_CURRENT_USER_LOADING);

    try {
      const loginResult = await verifyOtp(
        twoFactorRequired.email,
        twoFactorCode,
        twoFactorRequired.verifyType
      );
      if (loginResult.error) {
        setError(loginResult.error.message || 'auth.apiMessages.codeVerificationFailed');
        return;
      }
      if (loginResult.data?.jwt) {
        updateSession({
          token: loginResult.data?.jwt,
          user: loginResult.data?.user,
        });
        setUser(loginResult.data?.user as UserModel);
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirectTo') || '/';
        router.push(redirectTo);
      } else {
        setError('auth.apiMessages.codeVerificationFailed');
      }
    } catch (err) {
      setError('auth.apiMessages.codeVerificationFailed');
      console.error(err);
    } finally {
      setTwoFactorCode(''); // Clear code input
      setTimeout(() => {
        removeLoading(FETCH_CURRENT_USER_LOADING);
      }, 1000);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email(t('auth.messages.emailInvalid'))
        .required(t('auth.messages.emailRequired')),
      password: yup.string().required(t('auth.messages.passwordRequired')),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <Card className="py-8">
      <CardContent className="grid gap-4">
        {!twoFactorRequired ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                data-testid="signin-email"
                placeholder={t('auth.emailPlaceholder')}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-sm text-destructive">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisibility ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  data-testid="signin-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {passwordVisibility ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-sm text-destructive">
                  {formik.errors.password}
                </div>
              )}
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive">
                {t(error as unknown as Parameters<typeof t>[0])}
              </div>
            )}
            <Button type="submit" data-testid="signin-submit" className="w-full" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.login')}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTwoFactorSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="twoFactorCode">
                {twoFactorRequired.verifyType === 'totp'
                  ? t('auth.totpCode')
                  : t('auth.otpCode')}
              </Label>
              <Input
                id="twoFactorCode"
                type="text"
                placeholder={
                  twoFactorRequired.verifyType === 'totp'
                    ? t('auth.totpCodePlaceholder')
                    : t('auth.otpPlaceholder')
                }
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive">
                {t(error as unknown as Parameters<typeof t>[0])}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.verify')}
            </Button>
          </form>
        )}
        {!twoFactorRequired && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('auth.loginWith')}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/api/auth/connect/github`);
                }}
                disabled={loading}
              >
                <GithubIcon />
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/api/auth/connect/google`);
                }}
                disabled={loading}
              >
                <GoogleIcon />
                Google
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col mt-8">
        {!twoFactorRequired && (
          <div className="text-sm text-muted-foreground">
            {t('auth.doNotHaveAccount')}{' '}
            <Link
              href="/sign-up"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t('auth.signup')}
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
