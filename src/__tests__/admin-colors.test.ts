import fs from 'node:fs'
import path from 'node:path'

const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8')

function adminThemeBlock(selector: string) {
  const start = css.indexOf(selector)
  expect(start).toBeGreaterThanOrEqual(0)
  const open = css.indexOf('{', start)
  const close = css.indexOf('\n}', open)
  return css.slice(open + 1, close)
}

function variable(block: string, name: string) {
  const match = block.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))
  expect(match).not.toBeNull()
  return match![1]
}

function luminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a: string, b: string) {
  const first = luminance(a)
  const second = luminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

describe('admin color system', () => {
  const light = adminThemeBlock('body:has([data-admin-theme])')
  const dark = adminThemeBlock('html.dark body:has([data-admin-theme])')

  test.each([
    ['light body text', light, 'foreground', 'background'],
    ['light muted text', light, 'muted-foreground', 'background'],
    ['light primary button', light, 'primary-foreground', 'primary'],
    ['dark body text', dark, 'foreground', 'background'],
    ['dark muted text', dark, 'muted-foreground', 'background'],
    ['dark primary button', dark, 'primary-foreground', 'primary'],
    ['dark gold accent', dark, 'secondary-foreground', 'secondary'],
  ])('%s meets WCAG AA for normal text', (_label, block, foreground, background) => {
    expect(contrast(variable(block, foreground), variable(block, background))).toBeGreaterThanOrEqual(4.5)
  })

  test('admin chart implementation has no legacy fallback purple', () => {
    const chart = fs.readFileSync(path.join(process.cwd(), 'src/components/admin/charts.tsx'), 'utf8')
    expect(chart).not.toContain('#8884d8')
    expect(chart).toContain('ADMIN_CHART_COLORS')
  })
})
