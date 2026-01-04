'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { updateSession } from '@canva-web/src/core/actions/session';
import { createUser } from '@canva-web/src/services/auth.service';
import { Card, CardContent, CardFooter } from '@canva-web/src/components/base/card/Card';
import { Button } from '@canva-web/src/components/base/button/Button';
import { defaultRoute } from '@canva-web/src/core/guards/appRoutes';
import { useUserStore } from '@canva-web/src/store/useUserStore';

export function SignUpPageClient() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser)
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const togglePasswordVisibility = () => {
    setPasswordVisibility((visible) => !visible);
  };

  const {
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      re_password: '',
      agreement: false,
    },
    onSubmit: async (values) => {
      setError('');
      setLoading(true);

      const { firstName, lastName, phone, email, password } = values;
      const username = email;
      try {
        const result = await createUser({
          firstName,
          lastName,
          phone,
          email,
          username,
          password,
        });

        if (result?.error?.message || !result?.data?.user) {
          setError(result?.error?.message || t('auth.messages.emailExists'));
          return;
        } 
        setUser(result.data?.user);
        updateSession({
          token: result.data?.jwt,
          user: result.data?.user,
        });

        // Reload if in homepage
        setTimeout(() => {
          router.push(defaultRoute);
        });
      } catch (err) {
        setError(t('auth.messages.emailExists'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    validationSchema: yup.object().shape({
      firstName: yup
        .string()
        .required(t('auth.messages.firstNameRequired'))
        .test(
          'firstName',
          t('auth.messages.firstNameLength', { min: 1, max: 50 }),
          (val: any) => val && val.length >= 1 && val.length <= 50
        ),
      lastName: yup
        .string()
        .required(t('auth.messages.lastNameRequired'))
        .test(
          'lastName',
          t('auth.messages.lastNameLength', { min: 1, max: 50 }),
          (val: any) => val && val.length >= 1 && val.length <= 50
        ),
      phone: yup
        .string()
        .test(
          'phone',
          t('auth.messages.phoneLength', { min: 8, max: 12 }),
          (val: any) => {
            if (!val || val.length === 0) return true;
            const isNum = !isNaN(val);
            return isNum ? val.length >= 8 && val.length <= 12 : false;
          }
        ),
      email: yup
        .string()
        .required(t('auth.messages.emailRequired'))
        .email(t('auth.messages.emailInvalid')),
      password: yup.string().required(t('auth.messages.passwordRequired')),
      re_password: yup
        .string()
        .required(t('auth.messages.confirmPasswordRequired'))
        .oneOf(
          [yup.ref('password')],
          t('auth.messages.passwordsMustMatch')
        ),
      agreement: yup
        .bool()
        .test(
          'agreement',
          t('auth.messages.agreementRequired'),
          (value) => value === true
        )
        .required(t('auth.messages.agreementRequired')),
    }),
  });

  return (
    <Card className="pb-6">
      <CardContent className="grid gap-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  {t('auth.firstName')} *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  data-testid="signup-firstname"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder={t('auth.firstNamePlaceholder')}
                />
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  {t('auth.lastName')} *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  data-testid="signup-lastname"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder={t('auth.lastNamePlaceholder')}
                />
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t('auth.email')} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                data-testid="signup-email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('auth.emailPlaceholder')}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                data-testid="signup-phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('auth.phonePlaceholder')}
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisibility ? 'text' : 'password'}
                  required
                  data-testid="signup-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  {passwordVisibility ? t('common.hide') : t('common.show')}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="re_password"
                className="block text-sm font-medium"
              >
                {t('auth.confirmPassword')} *
              </label>
              <div className="relative">
                <input
                  id="re_password"
                  name="re_password"
                  type={passwordVisibility ? 'text' : 'password'}
                  required
                  data-testid="signup-confirm-password"
                  value={values.re_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  {passwordVisibility ? t('common.hide') : t('common.show')}
                </button>
              </div>
              {touched.re_password && errors.re_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.re_password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                data-testid="signup-agreement"
                checked={values.agreement}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="agreement"
                className="ml-2 block text-sm text-gray-900"
              >
                {t('auth.agreement')}{' '}
                <Link
                  href="/page/terms-and-conditions"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {t('auth.termsAndConditions')}
                </Link>
              </label>
            </div>
            {touched.agreement && errors.agreement && (
              <p className="mt-1 text-sm text-red-600">{errors.agreement}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              data-testid="signup-submit"
              disabled={loading || !isValid}
              className="w-full"
            >
              {loading ? t('auth.creatingAccount') : t('auth.signup')}
            </Button>
          </div>
        </form>

        <CardFooter className="flex flex-col mt-8">
          <p>
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.signin')}
            </Link>
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
