/**
 * Manually triggers rehydration after the component mounts.
 * This ensures the store is populated with persisted data only on the client side.
 */
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@canva-web/src/store/useUserStore';
import { useConfigurationStore } from '@canva-web/src/store/useConfigurationStore';

export default function ZustandHydration({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    useUserStore.persist.rehydrate();
    useUserStore.getState().setHydrated();
    
    useConfigurationStore.persist.rehydrate();
    // Configuration store will automatically fetch fresh data after rehydration
    // via onRehydrateStorage callback
  }, []);

  return <>{children}</>;
}
