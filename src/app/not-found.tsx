import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find your next adventure.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/safaris-tours"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
