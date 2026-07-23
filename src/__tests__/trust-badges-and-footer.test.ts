import fs from 'node:fs'
import path from 'node:path'

const trustBadges = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/trust-badges.tsx'), 'utf8')
const footer = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/footer.tsx'), 'utf8')

describe('public trust badges and footer contact', () => {
  test('uses readable semantic colors for award and local expert icons', () => {
    expect(trustBadges).toMatch(/title: 'Award-Winning Service',[\s\S]*?color: "text-featured"/)
    expect(trustBadges).toMatch(/title: 'Local Experts',[\s\S]*?color: "text-info"/)
    expect(trustBadges).not.toContain('color: "text-accent"')
  })

  test('does not render the pill-shaped WhatsApp action in the footer contact column', () => {
    expect(footer).not.toContain('href={`https://wa.me/${companyInfo.whatsapp}`}')
    expect(footer).not.toContain('<span>WhatsApp</span>')
  })
})
