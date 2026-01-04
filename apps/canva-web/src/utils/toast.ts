import { toast as toastFn } from "../hooks/use-toast";

/**
 * Utility functions for displaying toast notifications
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, title?: string) => {
    return toastFn({
      variant: "success",
      title: title || "Success",
      description: message,
    });
  },

  /**
   * Show an error toast
   */
  error: (message: string, title?: string) => {
    return toastFn({
      variant: "destructive",
      title: title || "Error",
      description: message,
    });
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, title?: string) => {
    return toastFn({
      variant: "warning",
      title: title || "Warning",
      description: message,
    });
  },

  /**
   * Show an info toast
   */
  info: (message: string, title?: string) => {
    return toastFn({
      variant: "info",
      title: title || "Info",
      description: message,
    });
  },

  /**
   * Show a default toast
   */
  default: (message: string, title?: string) => {
    return toastFn({
      variant: "default",
      title: title,
      description: message,
    });
  },
};

