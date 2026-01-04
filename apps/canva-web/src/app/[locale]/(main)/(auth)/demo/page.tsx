import { getDemoCredentials } from '@canva-web/config/Env';
import { logUserIn } from '@canva-web/src/services/auth.service';
import { notFound } from 'next/navigation';
import { DemoPageClient } from './client';
import { UserModel } from '@canva-web/src/models/user.model';

export default async function DemoPage() {
  const { email, password } = getDemoCredentials();
  
  if (!email || !password) {
    return notFound();
  }
  const loginResult = await logUserIn(email, password);

  if (!loginResult.data?.jwt || !loginResult.data?.user) {
    return notFound();
  }

  return (
    <DemoPageClient
      jwt={loginResult.data?.jwt}
      user={loginResult.data?.user as UserModel}
    />
  );
}
