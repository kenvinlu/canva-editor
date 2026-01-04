import { AuthLayout } from '@canva-web/src/components/layouts/auth-layout';
import { SignUpPageClient } from './client';
import { getGithubUrl } from '@canva-web/config/Env';
import { useTranslations } from 'next-intl';

export default function SignUpPage() {
  const t = useTranslations();

  return (
    <AuthLayout
      heading={t('auth.signUp')}
      subheading={t('auth.signUpNote')}
      githubUrl={getGithubUrl()}
    >
      <SignUpPageClient />
    </AuthLayout>
  );
}
