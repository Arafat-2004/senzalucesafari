"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 mb-4 font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="safari">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/admin/dashboard" className="inline-flex items-center justify-center px-4 py-2 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
