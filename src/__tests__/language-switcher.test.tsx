import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { LanguageSwitcher } from '@/components/ui/language-switcher'

describe('LanguageSwitcher Google integration', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('data-translation-provider')
    document.documentElement.removeAttribute('data-translation-status')
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'

    class FakeTranslateElement {
      constructor(_options: unknown, mountId: string) {
        const select = document.createElement('select')
        select.className = 'goog-te-combo'
        select.append(new Option('English', 'en'), new Option('Swahili', 'sw'))
        document.getElementById(mountId)?.appendChild(select)
      }
    }

    Object.assign(window, {
      google: {
        translate: {
          TranslateElement: FakeTranslateElement,
        },
      },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    delete (window as Window & { google?: unknown }).google
    delete (window as Window & { googleTranslateElementInit?: unknown }).googleTranslateElementInit
  })

  test('loads Google, initializes its combo, and requests the selected language', async () => {
    render(<LanguageSwitcher />)

    const script = document.getElementById('google-translate-script') as HTMLScriptElement
    expect(script).not.toBeNull()
    expect(script.src).toBe('https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit')
    act(() => {
      ;(window as Window & { googleTranslateElementInit?: () => void }).googleTranslateElementInit?.()
    })

    await waitFor(() => {
      expect(document.documentElement.dataset.translationProvider).toBe('google')
      expect(document.documentElement.dataset.translationStatus).toBe('ready')
    })

    const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement
    const changeHandler = jest.fn()
    combo.addEventListener('change', changeHandler)

    const nativeSetTimeout = window.setTimeout.bind(window)
    jest.spyOn(window, 'setTimeout').mockImplementation(((callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (delay === 350) return 1
      return nativeSetTimeout(callback, delay, ...args)
    }) as typeof window.setTimeout)

    fireEvent.click(screen.getByRole('button', { name: 'Switch language' }))
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /Kiswahili/ })[0])
      await Promise.resolve()
    })

    expect(changeHandler).toHaveBeenCalledTimes(1)
    expect(combo.value).toBe('sw')
    expect(document.cookie).toContain('googtrans=/en/sw')
    expect(document.documentElement.lang).toBe('sw')
  })
})
