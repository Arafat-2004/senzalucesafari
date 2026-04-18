export interface BlogSection {
    type: 'introduction' | 'heading' | 'paragraph' | 'image' | 'quote' | 'highlight' | 'list' | 'grid' | 'timeline' | 'cta';
    content?: Record<string, unknown>;
}

export interface RelatedPost {
    title: string;
    excerpt: string;
    image: string;
    slug: string;
    date: string;
}

export interface BlogArticle {
    slug: string;
    title: string;
    subtitle: string;
    excerpt?: string;
    author: string;
    authorBio: string;
    date: string;
    category: string;
    readTime: string;
    heroImage: string;
    imageUrl?: string;
    sections: BlogSection[];
    relatedPosts: RelatedPost[];
}
