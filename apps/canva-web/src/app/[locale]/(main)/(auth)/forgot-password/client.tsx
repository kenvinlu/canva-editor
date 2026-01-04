'use client';

import { Button } from '@canva-web/src/components/base/button/Button';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { forgotPassword } from '@canva-web/src/services/auth.service';
import { CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

export function ForgotPasswordPageClient() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (values: { email: string }) => {
    setError('');
    setLoading(true);

    try {
      const result = await forgotPassword(values.email);

      if (result.error) {
        setError(result.error.message || 'auth.apiMessages.forgotPasswordFailed');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('auth.apiMessages.forgotPasswordFailed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email(t('auth.messages.emailInvalid'))
        .required(t('auth.messages.emailRequired')),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <Card className="py-8">
      <CardContent className="grid gap-4">
        {!success ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  data-testid="forgot-password-email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pl-10"
                  required
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-sm text-destructive">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive">
                {t(error as unknown as Parameters<typeof t>[0])}
              </div>
            )}

            <Button type="submit" data-testid="forgot-password-submit" className="w-full" disabled={loading}>
              {loading ? t('auth.sending') : t('auth.sendResetLink')}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-6" data-testid="forgot-password-success">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t('auth.checkYourEmail')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('auth.resetLinkSent')} <strong>{formik.values.email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                {t('auth.resetLinkExpiry')}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSuccess(false);
                formik.resetForm();
              }}
            >
              {t('auth.sendAnotherLink')}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col mt-4">
        <Link
          href="/sign-in"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('auth.backToLogin')}
        </Link>
      </CardFooter>
    </Card>
  );
}
