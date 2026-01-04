'use client';

import { create } from 'zustand';
import { ICommonState } from './store.interfaces';

export const FETCH_CURRENT_USER_LOADING = 'FETCH_CURRENT_USER_LOADING';

export const useCommonStore = create<ICommonState>((set) => ({
  loadingActions: [],
  addLoading: (action) =>
    set((state) => ({
      loadingActions: [...state.loadingActions, action],
    })),
  removeLoading: (action) =>
    set((state) => ({
      loadingActions: state.loadingActions.filter((a) => a !== action),
    })),
  isLoading: (action: string): boolean => {
    return useCommonStore.getState().loadingActions.includes(action);
  },
}));
