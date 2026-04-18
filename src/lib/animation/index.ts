/**
 * Animation Library - Barrel Export
 * 
 * Centralized exports for all animation configuration and variants.
 * Import from here instead of individual files.
 * 
 * Usage:
 * ```ts
 * import { fadeInUp, MOTION_EASING, VIEWPORT_CONFIG } from '@/lib/animation';
 * ```
 */

export {
  MOTION_DURATIONS,
  MOTION_EASING,
  STAGGER_TIMES,
  MOTION_DISTANCES,
  VIEWPORT_CONFIG,
  MOBILE_MOTION,
  type MotionDuration,
  type MotionEasing,
  type StaggerTime,
} from '../motion-config';

export {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  slideInDown,
  staggerContainer,
  staggerItem,
  heroText,
  cardHover,
  imageLoad,
  modalAnimation,
  modalBackdrop,
  pageTransition,
  buttonPress,
  successCheck,
  loadingSpinner,
  subtlePulse,
  listItem,
} from '../motion-variants';
