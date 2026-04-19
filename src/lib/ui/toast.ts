import { toast } from 'sonner';

// Centralized toast wrapper with design-system defaults
export const showToast = (message: string, opts?: any) => {
  const defaultOpts = { duration: 2500, position: 'bottom-right' as const };
  return toast(message, { ...defaultOpts, ...(opts || {}) });
};
