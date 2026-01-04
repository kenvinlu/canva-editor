"use client";

import { useToastStore, type ToasterToast } from "../store/useToastStore";

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  return useToastStore.getState().addToast(props);
}

function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  };
}

export { useToast, toast };

