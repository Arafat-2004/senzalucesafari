import fs from 'node:fs'
import path from 'node:path'

const dashboard = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/page.tsx'), 'utf8')
const header = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/header.tsx'), 'utf8')

describe('dashboard loading resilience and public header alignment', () => {
  test('does not render the terminal no-data dashboard failure screen', () => {
    expect(dashboard).not.toContain('Unable to load dashboard')
    expect(dashboard).not.toContain('No data available')
    expect(dashboard).toContain('EMPTY_DASHBOARD_DATA')
  })

  test('guards state updates from aborted React strict-mode requests', () => {
    expect(dashboard).toContain('let active = true')
    expect(dashboard).toContain('if (active) setLoading(false)')
    expect(dashboard).toContain('active = false')
  })

  test('uses last-good session data and automatically reconnects', () => {
    expect(dashboard).toContain("window.sessionStorage.getItem(DASHBOARD_CACHE_KEY)")
    expect(dashboard).toContain("window.sessionStorage.setItem(DASHBOARD_CACHE_KEY")
    expect(dashboard).toContain('Connecting to live dashboard data')
  })

  test('centers desktop navigation in a three-column header grid', () => {
    expect(header).toContain('xl:grid-cols-[minmax(190px,1fr)_auto_minmax(310px,1fr)]')
    expect(header).toContain('justify-self-center')
    expect(header).toContain('justify-self-end')
    expect(header).toContain('aria-label="Primary navigation"')
  })
})
