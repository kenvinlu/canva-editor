import { AuthLayout } from "@canva-web/src/components/layouts/auth-layout";
import { VerifyCodePageClient } from "./client";
import { getGithubUrl } from "@canva-web/config/Env";

export default function VerifyCodePage() {
  return (
    <AuthLayout
      heading="Verify Code"
      subheading="Enter the code sent to your email to access your account"
      githubUrl={getGithubUrl()}
    >
      <VerifyCodePageClient />
    </AuthLayout>
  );
}
