import { AuthLayout } from "@canva-web/src/components/layouts/auth-layout";
import { ForgotPasswordPageClient } from "./client";
import { useTranslations } from "next-intl";
import { getGithubUrl } from "@canva-web/config/Env";

export default function ForgotPasswordPage() {
  const t = useTranslations();

  return (
    <AuthLayout
      heading={t('auth.forgotPassword')}
      subheading={t('auth.forgotPasswordNote')}
      githubUrl={getGithubUrl()}
    >
      <ForgotPasswordPageClient />
    </AuthLayout>
  );
}
