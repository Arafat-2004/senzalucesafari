import { toast } from 'sonner';

// Supported variants
export type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

// Centralized toast wrapper with design-system defaults and variant support
export const showToast = (
  message: string,
  opts?: { type?: ToastVariant; duration?: number; position?: string; [key: string]: any }
) => {
  const variant = (opts?.type ?? 'default') as ToastVariant;
  // Base options merge defaults with any overrides
  const baseOpts = {
    duration: 2500,
    position: 'bottom-right',
    ...(opts || {}),
  } as any;

  const t: any = toast as any;
  // If a variant-specific API exists (toast.success, toast.info, etc.), use it
  if (variant !== 'default' && typeof t[variant] === 'function') {
    const { type, duration, position, ...rest } = baseOpts;
    return t[variant](message, {
      duration: duration ?? 2500,
      position: position ?? 'bottom-right',
      ...rest,
    });
  }

  // Fallback to the default toast API
  const { duration, position, ...rest } = baseOpts;
  return toast(message, {
    duration: duration ?? 2500,
    position: position ?? 'bottom-right',
    ...rest,
  });
};
