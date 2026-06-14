'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IConfigurationState } from './store.interfaces';
import { Configuration, MenuItem } from '../models/configuration.model';

const defaultHeaderMenu: MenuItem[] = [
  { label: 'header.home', href: '/' },
  { label: 'header.templates', href: '/templates' },
  // { label: 'header.documentation', href: '/docs' },
  { label: 'header.blog', href: '/blog' },
  // { label: 'header.demo', href: '/demo', isAuth: true },
];

function processMenu(menu: MenuItem[] | undefined): MenuItem[] | null {
  if (!menu) {
    return null
  }
  return menu.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export const useConfigurationStore = create<IConfigurationState>()(
  persist(
    (set, get) => ({
      topMessage: null,
      topMessageEnabled: null,
      topMessageType: null,
      headerMenu: [],
      footerMenu: [],
      setConfiguration: (configuration: Partial<Configuration>) => set({
        topMessage: configuration.top_message || null,
        topMessageEnabled: configuration.top_message_enabled || null,
        topMessageType: configuration.top_message_type || null,
        headerMenu: processMenu(configuration.header_menu?.items) || defaultHeaderMenu,
        footerMenu: processMenu(configuration.footer_menu?.items) || [],
      }),
      getTopMessage: () => {
        return {
          topMessage: get().topMessage,
          topMessageEnabled: get().topMessageEnabled,
          topMessageType: get().topMessageType,
        };
      },
      getHeaderMenu: () => {
        return get().headerMenu || defaultHeaderMenu;
      },
    }),
    {
      name: 'configuration',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

