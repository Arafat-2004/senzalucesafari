import type { BlogSection } from '@/types/blogs'

/** Convert the admin's plain-language editor format into public article sections. */
export function contentToBlogSections(content: string): BlogSection[] {
  const blocks = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean)
  let introductionAdded = false

  return blocks.map((block) => {
    if (block.startsWith('### ')) {
      return { type: 'heading', content: { level: 3, text: block.slice(4).trim() } }
    }
    if (block.startsWith('## ')) {
      return { type: 'heading', content: { level: 2, text: block.slice(3).trim() } }
    }
    if (!introductionAdded) {
      introductionAdded = true
      return { type: 'introduction', content: { text: block } }
    }
    return { type: 'paragraph', content: { text: block } }
  })
}
