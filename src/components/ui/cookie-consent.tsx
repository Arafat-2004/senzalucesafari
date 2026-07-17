"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  }

  function dismiss() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="mx-auto max-w-3xl bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          We use cookies to enhance your browsing experience and analyze site traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/privacy" className="text-xs text-primary hover:underline underline-offset-2">
            Learn More
          </Link>
          <button
            onClick={accept}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Accept
          </button>
          <button
            onClick={dismiss}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
