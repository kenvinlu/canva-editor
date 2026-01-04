/**
 * Manually triggers rehydration after the component mounts.
 * This ensures the store is populated with persisted data only on the client side.
 */
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@canva-web/src/store/useUserStore';

export default function ZustandHydration({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    useUserStore.persist.rehydrate();
    useUserStore.getState().setHydrated();
  }, []);

  return <>{children}</>;
}
