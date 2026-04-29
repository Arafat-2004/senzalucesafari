import { toast } from 'sonner';

type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

interface ShowToastOptions {
  type?: ToastVariant;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const showToast = (message: string, opts?: ShowToastOptions) => {
  const variant = opts?.type ?? 'default';
  const duration = opts?.duration ?? 2500;
  const position = opts?.position ?? 'bottom-right';

  const toastOptions = { duration, position };

  switch (variant) {
    case 'info':
      return toast.info(message, toastOptions);
    case 'success':
      return toast.success(message, toastOptions);
    case 'warning':
      return toast.warning(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
};