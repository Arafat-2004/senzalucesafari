import fs from 'node:fs'
import path from 'node:path'

const overview = fs.readFileSync(
  path.join(process.cwd(), 'src/components/admin/dashboard-overview.tsx'),
  'utf8',
)
const analytics = fs.readFileSync(path.join(process.cwd(), 'src/lib/analytics.ts'), 'utf8')

describe('admin dashboard insight panels', () => {
  test('uses valid chart tokens rather than wrapping hex tokens in hsl()', () => {
    expect(overview).not.toContain('hsl(var(--')
    expect(overview).toContain('fill: "var(--chart-axis)"')
    expect(overview).toContain('stroke="var(--chart-grid)"')
  })

  test('explains booking value without implying online payment processing', () => {
    expect(overview).toContain('Booking Value & Volume')
    expect(overview).toContain('This is not online payment revenue.')
    expect(overview).toContain('Booking value')
  })

  test('provides meaningful zero-data states and readable non-chart summaries', () => {
    expect(overview).toContain('No booking activity in this period')
    expect(overview).toContain('No bookings recorded yet')
    expect(overview).toContain('Most booked packages ranking')
    expect(overview).toContain('New Booking Customers')
  })

  test('fills reporting months and calculates customers from their earliest booking', () => {
    expect(analytics).toContain('getMonthKeys(startDate, endDate)')
    expect(analytics).toContain('firstBookingByEmail')
    expect(analytics).toContain('status: { not: "CANCELLED" }')
  })
})
