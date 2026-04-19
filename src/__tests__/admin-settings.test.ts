import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminSettingsPage from '@/app/admin/settings/page'
import { showToast } from '@/lib/ui/toast'

jest.mock('@/lib/ui/toast', () => ({
  showToast: jest.fn(),
}))

describe('Admin Settings Page', () => {
  beforeEach(() => {
    ;(showToast as jest.Mock).mockReset()
    ;(global.fetch as any) = jest.fn((...args: any[]) => {
      const [url] = args
      if (typeof url === 'string' && url.endsWith('/api/settings')) {
        return Promise.resolve({ ok: true, json: async () => ({ siteTitle: 'Senza Luce Safaris', siteUrl: 'https://example.com', environment: 'production' }) })
      }
      if (typeof url === 'string' && url.endsWith('/api/settings/roles')) {
        return Promise.resolve({ ok: true, json: async () => [] })
      }
      if (typeof url === 'string' && url.endsWith('/api/settings/history')) {
        return Promise.resolve({ ok: true, json: async () => [] })
      }
      return Promise.resolve({ ok: true, json: async () => ({}) })
    }) as any
  })

  test('loads settings and saves changes', async () => {
    const { getByLabelText, getByText } = render(<AdminSettingsPage />)

    // Ensure the page has loaded fields
    const titleInput = await screen.findByLabelText('Site Title')
    expect(titleInput).toBeInTheDocument()

    // Change a field
    fireEvent.change(titleInput, { target: { value: 'New Site Title' } })

    // Click Save
    const saveBtn = getByText('Save Settings')
    fireEvent.click(saveBtn)

    // Expect PATCH to /api/settings
    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls
      const patchCall = calls.find((c) => c[0] === '/api/settings' && c[1]?.method === 'PATCH')
      expect(patchCall).toBeTruthy()
    })

    // Validate request body had updated siteTitle
    const patchCall = (global.fetch as jest.Mock).mock.calls.find((c) => c[0] === '/api/settings' && c[1]?.method === 'PATCH')
    const body = JSON.parse(patchCall?.[1]?.body)
    expect(body.siteTitle).toBe('New Site Title')
    // Toast feedback
    expect(showToast).toHaveBeenCalledWith('Settings saved', { type: 'success' })
  })
})
