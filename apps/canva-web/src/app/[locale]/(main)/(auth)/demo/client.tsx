'use client';

import { UserModel } from '@canva-web/src/models/user.model';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateSession } from '@canva-web/src/core/actions/session';
import { defaultRoute } from '@canva-web/src/core/guards/appRoutes';

export function DemoPageClient({
  jwt,
  user,
}: {
  jwt: string;
  user: UserModel;
}) {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    updateSession({
      token: jwt,
      user: user,
      isDemo: true,
    });
    setUser(user);
    router.push(defaultRoute);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Navigating to home...</h2>
    </div>
  );
}
