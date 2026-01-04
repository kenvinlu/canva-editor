import { Button } from '@canva-web/src/components/base/button/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@canva-web/src/components/base/card/Card';
import { Input } from '@canva-web/src/components/base/input/Input';
import { Label } from '@canva-web/src/components/base/label/Label';
import { useTranslations } from 'next-intl';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { changePassword } from '@canva-web/src/services/auth.service';
import { useState } from 'react';

function PasswordProfileCard() {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <Card className="py-4 gap-6">
      <CardHeader>
        <CardTitle>{t('auth.securitySettings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <Formik
          initialValues={{
            currentPassword: '',
            password: '',
            passwordConfirmation: '',
          }}
          validationSchema={Yup.object({
            currentPassword: Yup.string()
              .required(t('auth.messages.currentPasswordRequired')),
            password: Yup.string()
              .min(6, t('auth.messages.passwordMinLength'))
              .required(t('auth.messages.newPasswordRequired')),
            passwordConfirmation: Yup.string()
              .oneOf([Yup.ref('password')], t('auth.messages.passwordsDoNotMatch'))
              .required(t('auth.messages.confirmPasswordRequired')),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError('');
            setMessage('');
            
            try {
              const result = await changePassword({
                currentPassword: values.currentPassword,
                password: values.password,
                passwordConfirmation: values.passwordConfirmation,
              });
              
              if (result?.data) {
                setMessage(t('auth.messages.passwordUpdatedSuccessfully'));
                resetForm();
              } else {
                setError(
                  result?.error?.message
                    ? t(result.error.message)
                    : t('auth.messages.passwordUpdateFailed')
                );
              }
            } catch (err) {
              setError(t('auth.messages.passwordUpdateFailed'));
              console.error('Password change error:', err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, isValid, dirty }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">{t('auth.messages.currentPasswordRequired')}</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder={t('auth.messages.currentPasswordPlaceholder')}
                  aria-invalid={touched.currentPassword && !!errors.currentPassword ? true : undefined}
                  {...getFieldProps('currentPassword')}
                />
                {touched.currentPassword && errors.currentPassword && (
                  <p className="text-xs text-destructive">{errors.currentPassword}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">{t('auth.messages.newPasswordRequired')}</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder={t('auth.messages.newPasswordPlaceholder')}
                  aria-invalid={touched.password && !!errors.password ? true : undefined}
                  {...getFieldProps('password')}
                />
                {touched.password && errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">
                  {t('auth.messages.confirmPasswordRequired')}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder={t('auth.messages.confirmNewPasswordPlaceholder')}
                  aria-invalid={touched.passwordConfirmation && !!errors.passwordConfirmation ? true : undefined}
                  {...getFieldProps('passwordConfirmation')}
                />
                {touched.passwordConfirmation && errors.passwordConfirmation && (
                  <p className="text-xs text-destructive">{errors.passwordConfirmation}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="submit" disabled={isSubmitting || !isValid || !dirty}>
                  {t('auth.messages.updatePassword')}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default PasswordProfileCard;
