'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUserState } from './store.interfaces';
import { UserModel } from '../models/user.model';

export const useUserStore = create<IUserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isLoggedIn: false,
      hydrated: false,
      setUser: (user: UserModel) => set({ userData: user, isLoggedIn: true }),
      updateUser: (user: Partial<UserModel>) =>
        set((state) => ({
          userData: state.userData ? { ...state.userData, ...user } : null,
          // hydrated: true,
        })),
      logout: () => set({ userData: null, isLoggedIn: false }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
      partialize: (state) => ({
        userData: state.userData,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);