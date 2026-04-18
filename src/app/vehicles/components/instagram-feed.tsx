"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { instagramPosts } from "../data";
import { useAnalytics } from "../hooks/use-analytics";

export default function InstagramFeed() {
    const [hoveredPost, setHoveredPost] = useState<number | null>(null);
    const { trackEvent } = useAnalytics();

    const handlePostClick = (postId: number) => {
        trackEvent('instagram_post_click', { postId });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Follow Our Safari Adventures
                </h3>
                <p className="text-muted-foreground mb-6">
                    See real moments from our safaris and share your own experiences with us!
                </p>
                <a
                    href="https://instagram.com/senzalucesafaris"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('instagram_profile_visit')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                    <Heart className="w-5 h-5 mr-2" />
                    @SenzaLuceSafaris
                    <ExternalLink className="w-4 h-4 ml-2" />
                </a>
            </div>

            {/* Instagram Grid */}

            {/* Instagram Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {instagramPosts.map(post => (
                    <div
                        key={post.id}
                        className="relative group cursor-pointer aspect-square overflow-hidden rounded-xl bg-card border border-border/50"
                        onMouseEnter={() => setHoveredPost(post.id)}
                        onMouseLeave={() => setHoveredPost(null)}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <Image
                            src={post.imageUrl}
                            alt={post.caption}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Hover Overlay */}
                        <div
                            className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className="text-white text-center">
                                <div className="flex items-center justify-center space-x-4 mb-2">
                                    <div className="flex items-center">
                                        <Heart className="w-5 h-5 mr-1 fill-current" />
                                        <span className="font-semibold">{post.likes}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="w-5 h-5 mr-1" />
                                        <span className="font-semibold">{post.comments}</span>
                                    </div>
                                </div>
                                <p className="text-xs px-4 line-clamp-3">{post.caption}</p>
                            </div>
                        </div>

                        {/* Hashtag Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded backdrop-blur-sm">
                            {post.hashtag}
                        </div>
                    </div>
                ))}
            </div>

            {/* API Integration Notice */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-2">Live Instagram Feed</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            This section can be connected to the Instagram Graph API to automatically display your latest posts. Currently showing demo content.
                        </p>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Create an Instagram Business Account</li>
                            <li>Get Facebook Developer API credentials</li>
                            <li>Set up Next.js API route for token management</li>
                            <li>Fetch posts automatically using Instagram Graph API</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <p className="text-muted-foreground mb-4">
                    Share your safari moments with us!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {['#SenzaLuceSafaris', '#MySafariMoment', '#TanzaniaSafari', '#WildlifePhotography'].map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
