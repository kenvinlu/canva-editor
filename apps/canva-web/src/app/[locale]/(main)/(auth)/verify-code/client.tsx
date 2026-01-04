'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { Separator } from '@canva-web/src/components/base/separator/Separator';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function VerifyCodePageClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('e') || '';
  const verifyType = searchParams.get('vt') || '';
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (values: {
    email: string;
    verifyType: string;
    code: string;
  }) => {
    setError('');
    setLoading(true);

    // try {
    //   const loginResult = await logUserIn(values.email, values.password);

    //   if (loginResult) {
    //     console.log(loginResult)
    //     updateSession({
    //       token: loginResult.jwt,
    //       user: loginResult.user,
    //     });
    //     setUser(loginResult.user);
    //     const searchParams = new URLSearchParams(window.location.search);
    //     const redirectTo = searchParams.get('redirectTo') || '/';
    //     router.push(redirectTo);
    //   }
    // } catch (err) {
    //   setError(t("auth.messages.loginFailed"));
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  const formik = useFormik({
    initialValues: {
      email,
      verifyType,
      code: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email(t('auth.messages.emailInvalid'))
        .required(t('auth.messages.emailRequired')),
      verifyType: yup.string().required(t('auth.messages.verifyTypeRequired')),
      code: yup.string().required(t('auth.messages.codeRequired')),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t('auth.login')}
            </CardTitle>
            <CardDescription>{t('auth.loginNote')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <input type="hidden" name="email" value={formik.values.email} />
              <input
                type="hidden"
                name="verifyType"
                value={formik.values.verifyType}
              />
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code">{t('auth.code')}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="code"
                    type="text"
                    autoComplete="off"
                    placeholder={t('auth.codePlaceholder')}
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                </div>
                {formik.touched.code && formik.errors.code && (
                  <div className="text-sm text-destructive">
                    {formik.errors.code}
                  </div>
                )}
              </div>
              {error && (
                <div className="text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth.verifying') : t('auth.verify')}
              </Button>
            </form>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
