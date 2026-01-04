import { AuthLayout } from "@canva-web/src/components/layouts/auth-layout";
import { SignInPageClient } from "./client";
import { useTranslations } from "next-intl";
import { getGithubUrl } from "@canva-web/config/Env";

export default function SignInPage() {
  const t = useTranslations();

  return (
    <AuthLayout
      heading={t('auth.login')}
      subheading={t('auth.loginNote')}
      githubUrl={getGithubUrl()}
    >
      <SignInPageClient />
    </AuthLayout>
  );
}
