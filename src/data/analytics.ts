// Fallback static data for analytics when database is unreachable

export const FALLBACK_ADVANCED_ANALYTICS = {
    stats: {
        bookings: {
            total: 15,
            pending: 3,
            confirmed: 12
        },
        revenue: 7980,
        inquiries: {
            total: 18,
            unread: 4
        }
    },
    conversion: {
        conversionRate: 33.3
    },
    trends: {
        growth: 15.4
    },
    topTours: [
        { id: "5-days-wildlife", name: "5 Days Wildlife Safari", bookingsCount: 8, revenue: 5200 },
        { id: "9-days-safari-zanzibar", name: "9 Days Safari & Zanzibar", bookingsCount: 4, revenue: 2780 }
    ],
    revenueData: [
        { month: "Jan", revenue: 1200 },
        { month: "Feb", revenue: 1800 },
        { month: "Mar", revenue: 2200 },
        { month: "Apr", revenue: 1500 },
        { month: "May", revenue: 2980 },
        { month: "Jun", revenue: 3500 },
        { month: "Jul", revenue: 4500 }
    ],
    topDestinations: [
        { name: "Serengeti National Park", bookingsCount: 8, revenue: 5200 },
        { name: "Ngorongoro Crater", bookingsCount: 6, revenue: 3900 },
        { name: "Tarangire National Park", bookingsCount: 4, revenue: 2600 }
    ]
};

export const FALLBACK_EVENTS_ANALYTICS = {
    totalEvents: 23,
    eventsByType: [
        { eventType: "page_view", _count: 11 },
        { eventType: "cta", _count: 11 },
        { eventType: "funnel", _count: 1 }
    ],
    eventsByName: [
        { eventName: "page_view_home", _count: 6 },
        { eventName: "page_view_tours", _count: 5 },
        { eventName: "cta_book", _count: 11 }
    ],
    ctaByContext: [
        { context: "tour_card", _count: 11 }
    ],
    eventsByTour: [
        { tourId: "5-days-wildlife", _count: 8 },
        { tourId: "9-days-safari-zanzibar", _count: 3 }
    ],
    recentEvents: [
        { id: "e1", eventName: "cta_book", eventType: "cta", context: "tour_card", timestamp: "2026-07-23T12:00:00Z" },
        { id: "e2", eventName: "cta_book", eventType: "cta", context: "tour_card", timestamp: "2026-07-23T11:30:00Z" },
        { id: "e3", eventName: "cta_book", eventType: "cta", context: "tour_card", timestamp: "2026-07-22T15:00:00Z" },
        { id: "e4", eventName: "page_view_home", eventType: "page_view", context: "home", timestamp: "2026-07-22T14:45:00Z" },
        { id: "e5", eventName: "cta_book", eventType: "cta", context: "tour_card", timestamp: "2026-07-22T10:00:00Z" }
    ]
};
