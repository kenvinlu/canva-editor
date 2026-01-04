'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { resetPassword } from '@canva-web/src/services/auth.service';

export function ResetPasswordPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const resetCode = searchParams.get('code');
    if (!resetCode) {
      setError('auth.apiMessages.invalidResetLink');
    } else {
      setCode(resetCode);
    }
  }, [searchParams]);

  const handleFormSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!code) {
      setError('auth.apiMessages.invalidResetLink');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await resetPassword(code, values.password);

      if (result.error) {
        setError(result.error.message || 'auth.apiMessages.resetPasswordFailed');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      }
    } catch (err) {
      setError('auth.apiMessages.resetPasswordFailed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object().shape({
      password: yup
        .string()
        .min(6, t('auth.messages.passwordMinLength'))
        .required(t('auth.messages.passwordRequired')),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], t('auth.messages.passwordsMustMatch'))
        .required(t('auth.messages.confirmPasswordRequired')),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <Card className="py-8">
      <CardContent className="grid gap-4">
        {!success ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">{t('auth.newPassword')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisibility ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('auth.newPasswordPlaceholder')}
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

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={confirmPasswordVisibility ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                >
                  {confirmPasswordVisibility ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-sm text-destructive">
                  {formik.errors.confirmPassword}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive">
                {t(error as unknown as Parameters<typeof t>[0])}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !code}>
              {loading ? t('auth.resetting') : t('auth.resetPassword')}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t('auth.passwordResetSuccess')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('auth.redirectingToLogin')}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {!success && (
        <CardFooter className="flex flex-col mt-4">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.backToLogin')}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
