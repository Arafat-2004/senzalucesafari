/**
 * JSON-LD structured data components for SEO rich results.
 * 
 * Usage: Place <JsonLd data={...} /> in page components.
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com'

/** Site-wide LocalBusiness / TravelAgency schema */
export function OrganizationJsonLd() {
    return (
        <JsonLd
            data={{
                '@context': 'https://schema.org',
                '@type': 'TravelAgency',
                name: 'Senza Luce Safaris',
                url: SITE_URL,
                logo: `${SITE_URL}/images/logo.png`,
                description: 'Comfortable, authentic, and unforgettable safari experiences across Tanzania.',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Arusha',
                    addressCountry: 'TZ',
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    availableLanguage: ['English', 'Swahili'],
                },
                sameAs: [],
            }}
        />
    )
}

/** Tour / TouristTrip schema */
export function TourJsonLd({
    name,
    description,
    imageUrl,
    slug,
    priceFrom,
    duration,
    rating,
    reviewCount,
}: {
    name: string
    description: string
    imageUrl: string
    slug: string
    priceFrom: number
    duration: string
    rating: number
    reviewCount: number
}) {
    return (
        <JsonLd
            data={{
                '@context': 'https://schema.org',
                '@type': 'TouristTrip',
                name,
                description,
                image: imageUrl,
                url: `${SITE_URL}/safaris-tours/${slug}`,
                touristType: 'Safari',
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: priceFrom,
                    availability: 'https://schema.org/InStock',
                },
                ...(duration && {
                    itinerary: {
                        '@type': 'ItemList',
                        description: duration,
                    },
                }),
                ...(reviewCount > 0 && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: rating,
                        reviewCount,
                        bestRating: 10,
                        worstRating: 0,
                    },
                }),
                provider: {
                    '@type': 'TravelAgency',
                    name: 'Senza Luce Safaris',
                    url: SITE_URL,
                },
            }}
        />
    )
}

/** BlogPosting schema */
export function BlogPostJsonLd({
    title,
    description,
    slug,
    author,
    publishedAt,
    updatedAt,
    featuredImage,
}: {
    title: string
    description: string
    slug: string
    author: string
    publishedAt: string
    updatedAt: string
    featuredImage: string
}) {
    return (
        <JsonLd
            data={{
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: title,
                description,
                image: featuredImage,
                url: `${SITE_URL}/blog/${slug}`,
                datePublished: publishedAt,
                dateModified: updatedAt,
                author: {
                    '@type': 'Person',
                    name: author,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Senza Luce Safaris',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${SITE_URL}/images/logo.png`,
                    },
                },
            }}
        />
    )
}

/** FAQPage schema */
export function FAQPageJsonLd({
    faqs,
}: {
    faqs: { question: string; answer: string }[]
}) {
    return (
        <JsonLd
            data={{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            }}
        />
    )
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
    items,
}: {
    items: { name: string; url: string }[]
}) {
    return (
        <JsonLd
            data={{
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: items.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
                })),
            }}
        />
    )
}
