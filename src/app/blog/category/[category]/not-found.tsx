import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container text-center py-20">
                <div className="max-w-md mx-auto">
                    <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                    <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
                    <p className="text-muted-foreground mb-8">
                        The category you&apos;re looking for doesn&apos;t exist or may have been moved.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/blog">
                            <Button variant="safari">
                                <ArrowLeft className="mr-2 w-4 h-4" />
                                Back to Blog
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                Go to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
