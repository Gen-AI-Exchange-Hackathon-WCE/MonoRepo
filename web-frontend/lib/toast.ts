import { toast } from "sonner";

/**
 * Utility functions for consistent toast notifications across the app
 */

export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
  });
};

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
  });
};

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
  });
};

export const showWarningToast = (title: string, description?: string) => {
  toast.warning(title, {
    description,
  });
};

export const showLoadingToast = (title: string, description?: string) => {
  return toast.loading(title, {
    description,
  });
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Promise-based toast for async operations
export const showPromiseToast = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  });
};