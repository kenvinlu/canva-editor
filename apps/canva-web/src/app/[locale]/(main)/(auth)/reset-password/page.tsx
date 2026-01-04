import { AuthLayout } from "@canva-web/src/components/layouts/auth-layout";
import { ResetPasswordPageClient } from "./client";
import { useTranslations } from "next-intl";
import { getGithubUrl } from "@canva-web/config/Env";

export default function ResetPasswordPage() {
  const t = useTranslations();

  return (
    <AuthLayout
      heading={t('auth.resetPassword')}
      subheading={t('auth.resetPasswordNote')}
      githubUrl={getGithubUrl()}
    >
      <ResetPasswordPageClient />
    </AuthLayout>
  );
}
