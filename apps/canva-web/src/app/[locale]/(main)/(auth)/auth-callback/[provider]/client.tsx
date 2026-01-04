'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userLogInProvider } from '@canva-web/src/services/auth.service';
import { useTranslations } from 'next-intl';
import PageTransition from '@canva-web/src/components/PageTransition';
import { updateSession } from '@canva-web/src/core/actions/session';
import { useUserStore } from '@canva-web/src/store/useUserStore';

const AuthCallbackClient = ({ provider }: { provider: string }) => {
    const t = useTranslations();
    const router = useRouter();
    const [text, setText] = useState(t('common.loading') + '...');
    const setUser = useUserStore((s) => s.setUser)
  
    useEffect(() => {
      userLogInProvider(provider)
        .then((res) => {
          if (!res.data?.user) {
             throw new Error(res.data?.message);
          }
          updateSession({
            token: res.data?.jwt,
            user: res.data?.user,
          });
          setUser(res.data?.user);
          setText(t('common.pageNavigating') + '...');
          setTimeout(() => router.push('/'), 3000); // Redirect to homepage after 3 sec
        })
        .catch((err) => {
          console.log(err);
          setText(
            `${t('common.messages.error')} <br /><a href="/">${t(
              'common.home'
            )}</a>`
          );
        });
    }, []);
  
    return (
      <div
        style={{
          backgroundColor: '#1e1e2d',
          height: '100vh',
          paddingTop: '30vh',
        }}
      >
        {/* <title>{t('auth.login')}</title> */}
        <PageTransition />
        <p style={{ color: '#fff', textAlign: 'center' }}>
          <span
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></span>
        </p>
      </div>
    );
  };

  export default AuthCallbackClient;
  