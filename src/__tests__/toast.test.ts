import { showToast } from '@/lib/ui/toast'

// Mock the Sonner toast API
jest.mock('sonner', () => {
  const fn = jest.fn()
  const info = jest.fn()
  const success = jest.fn()
  const warning = jest.fn()
  const error = jest.fn()
  const toast: any = Object.assign(fn, { info, success, warning, error })
  return { toast }
})

// Import after mocking so the module uses the mocked implementation
import { toast } from 'sonner'

describe('showToast (variant-aware wrapper)', () => {
  beforeEach(() => {
    ;(toast as any).mockClear()
    ;(toast as any).info?.mockClear()
    ;(toast as any).success?.mockClear()
    ;(toast as any).warning?.mockClear()
    ;(toast as any).error?.mockClear()
  })

  test('default variant uses default toast', () => {
    showToast('Hello World')
    expect((toast as any).mock.calls.length).toBeGreaterThan(0)
    expect((toast as any).mock.calls[0][0]).toBe('Hello World')
    expect((toast as any).mock.calls[0][1]).toEqual(expect.objectContaining({ duration: 2500, position: 'bottom-right' }))
  })

  test('success variant uses toast.success', () => {
    showToast('Great!', { type: 'success', duration: 1500 })
    expect((toast as any).success).toHaveBeenCalledWith('Great!', expect.objectContaining({ duration: 1500, position: 'bottom-right' }))
  })

  test('info variant uses toast.info', () => {
    showToast('Info message', { type: 'info' })
    expect((toast as any).info).toHaveBeenCalledWith('Info message', expect.any(Object))
  })

  test('warning variant uses toast.warning', () => {
    showToast('Be careful', { type: 'warning' })
    expect((toast as any).warning).toHaveBeenCalledWith('Be careful', expect.any(Object))
  })

  test('error variant uses toast.error', () => {
    showToast('Something went wrong', { type: 'error' })
    expect((toast as any).error).toHaveBeenCalledWith('Something went wrong', expect.any(Object))
  })
})
