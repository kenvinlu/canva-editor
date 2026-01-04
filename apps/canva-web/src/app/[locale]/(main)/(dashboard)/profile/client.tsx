'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@canva-web/src/components/base/tabs/Tabs';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { Lock, Shield, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import GeneralProfileCard from '@canva-web/src/components/profile/GeneralCard';
import PasswordProfileCard from '@canva-web/src/components/profile/PasswordCard';
import SecurityProfileCard from '@canva-web/src/components/profile/SecurityCard';
import { useRouter, useSearchParams } from 'next/navigation';

export function ProfilePageClient() {
  const t = useTranslations();
  const user = useUserStore((state) => state.userData);
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'general';
  const router = useRouter();

  return (
    <div className="container space-y-6 p-4 md:p-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('auth.profile')}
        </h2>
        <p className="text-muted-foreground">
          {t('auth.manageProfileAndSecuritySettings')}
        </p>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="general"
            className="flex items-center gap-2"
            onClick={() => {
              router.push('/profile?tab=general');
            }}
          >
            <User className="h-4 w-4" />
            {t('auth.general')}
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="flex items-center gap-2"
            onClick={() => {
              router.push('/profile?tab=password');
            }}
          >
            <Lock className="h-4 w-4" />
            {t('auth.password')}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2"
            onClick={() => {
              router.push('/profile?tab=security');
            }}
          >
            <Shield className="h-4 w-4" />
            {t('auth.security')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralProfileCard user={user} />
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <PasswordProfileCard />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityProfileCard user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
