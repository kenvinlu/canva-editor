'use client';

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
import { UserModel } from '@canva-web/src/models/user.model';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { updateUserProfile } from '@canva-web/src/services/auth.service';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { useState } from 'react';

function GeneralProfileCard({ user }: { user?: UserModel | null }) {
  const t = useTranslations();
  const updateUser = useUserStore((state) => state.updateUser);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return null;
  }

  return (
    <Card className="py-4 gap-6">
      <CardHeader>
        <CardTitle>{t('auth.profileInformation')}</CardTitle>
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
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            email: user.email || '',
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .trim()
              .required(t('auth.messages.firstNameRequired')),
            lastName: Yup.string()
              .trim()
              .required(t('auth.messages.lastNameRequired')),
            phone: Yup.string().trim().max(20, t('auth.messages.phoneInvalid')),
            email: Yup.string()
              .trim()
              .email(t('auth.messages.emailInvalid'))
              .required(t('auth.messages.emailRequired')),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setError('');
            setMessage('');
            
            try {
              const result = await updateUserProfile({
                ...user,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                email: values.email,
              } as UserModel);

              if (result?.data) {
                updateUser({
                  firstName: result.data.firstName,
                  lastName: result.data.lastName,
                  phone: result.data.phone,
                  email: result.data.email,
                });
                setMessage(t('auth.messages.profileUpdatedSuccessfully'));
              } else {
                setError(
                  result?.error?.message
                    ? t(result.error.message)
                    : t('auth.messages.profileUpdateFailed')
                );
              }
            } catch (err) {
              setError(t('auth.messages.profileUpdateFailed'));
              console.error('Profile update error:', err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleSubmit,
            getFieldProps,
            touched,
            errors,
            isSubmitting,
            dirty,
            isValid,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                <Input
                  id="firstName"
                  placeholder={t('auth.firstNamePlaceholder')}
                  aria-invalid={
                    touched.firstName && !!errors.firstName ? true : undefined
                  }
                  {...getFieldProps('firstName')}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                <Input
                  id="lastName"
                  placeholder={t('auth.lastNamePlaceholder')}
                  aria-invalid={
                    touched.lastName && !!errors.lastName ? true : undefined
                  }
                  {...getFieldProps('lastName')}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input
                  id="phone"
                  placeholder={t('auth.phonePlaceholder')}
                  aria-invalid={
                    touched.phone && !!errors.phone ? true : undefined
                  }
                  {...getFieldProps('phone')}
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  aria-invalid={
                    touched.email && !!errors.email ? true : undefined
                  }
                  {...getFieldProps('email')}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  {t('auth.saveChanges')}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default GeneralProfileCard;
