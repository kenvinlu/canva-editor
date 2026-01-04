'use client';

import { create } from 'zustand';
import type { ToastActionElement, ToastProps } from '../components/toast/Toast';
import * as React from 'react';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Store timeouts outside of Zustand state since Maps aren't serializable
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

interface IToastState {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, 'id'>) => { id: string; dismiss: () => void; update: (props: Partial<ToasterToast>) => void };
  updateToast: (id: string, toast: Partial<ToasterToast>) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId: string) => void;
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const useToastStore = create<IToastState>((set, get) => ({
  toasts: [],

  addToast: (toastProps) => {
    const id = genId();
    const toast: ToasterToast = {
      ...toastProps,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          get().dismissToast(id);
        }
      },
    };

    set((state) => ({
      toasts: [toast, ...state.toasts].slice(0, TOAST_LIMIT),
    }));

    return {
      id,
      dismiss: () => get().dismissToast(id),
      update: (props) => get().updateToast(id, props),
    };
  },

  updateToast: (id, toastProps) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...toastProps } : t
      ),
    }));
  },

  dismissToast: (toastId) => {
    const state = get();
    
    if (toastId) {
      // Add to remove queue
      if (!toastTimeouts.has(toastId)) {
        const timeout = setTimeout(() => {
          get().removeToast(toastId);
        }, TOAST_REMOVE_DELAY);
        
        toastTimeouts.set(toastId, timeout);
      }

      // Mark as closed
      set((state) => ({
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }));
    } else {
      // Dismiss all
      state.toasts.forEach((toast) => {
        if (!toastTimeouts.has(toast.id)) {
          const timeout = setTimeout(() => {
            get().removeToast(toast.id);
          }, TOAST_REMOVE_DELAY);
          
          toastTimeouts.set(toast.id, timeout);
        }
      });

      set((state) => ({
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      }));
    }
  },

  removeToast: (toastId) => {
    // Clear timeout if exists
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.delete(toastId);
    }

    // Remove toast
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== toastId),
    }));
  },
}));

