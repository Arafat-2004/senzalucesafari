import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

import { BlogSearchGrid } from '@/components/blog/blog-search-grid'

const posts = [
  {
    id: '1',
    title: 'Serengeti Lodge Guide',
    slug: 'serengeti-lodge-guide',
    excerpt: 'A guide to safari accommodation.',
    imageUrl: '/lodge.jpg',
    author: 'Senza Luce',
    date: 'July 29, 2026',
    readTime: '5 min read',
    category: 'Accommodation & Luxury',
    featured: false,
  },
  {
    id: '2',
    title: 'Packing for Tanzania',
    slug: 'packing-for-tanzania',
    excerpt: 'What to pack for your safari.',
    imageUrl: '/packing.jpg',
    author: 'Senza Luce',
    date: 'July 29, 2026',
    readTime: '4 min read',
    category: 'Travel Tips',
    featured: false,
  },
]

describe('BlogSearchGrid responsive category filters', () => {
  test('uses a wrapping mobile grid rather than a clipped horizontal strip', () => {
    render(<BlogSearchGrid posts={posts} />)

    const filters = screen.getByRole('group', { name: 'Filter articles by category' })
    expect(filters).toHaveClass('grid-cols-2', 'min-[480px]:grid-cols-3', 'sm:flex')
    expect(filters).not.toHaveClass('overflow-x-auto')

    for (const button of within(filters).getAllByRole('button')) {
      expect(button).toHaveClass('min-w-0', 'min-h-11')
    }
  })

  test('keeps category filtering functional', () => {
    render(<BlogSearchGrid posts={posts} />)

    fireEvent.click(screen.getByRole('button', { name: 'Travel Tips' }))

    expect(screen.getByText('Packing for Tanzania')).toBeInTheDocument()
    expect(screen.queryByText('Serengeti Lodge Guide')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Travel Tips' })).toHaveAttribute('aria-pressed', 'true')
  })
})
