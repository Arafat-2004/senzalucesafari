"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent-v2");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function choose(choice: 'analytics' | 'necessary') {
    localStorage.setItem("cookie-consent-v2", choice);
    setVisible(false);
    window.dispatchEvent(new Event('cookie-consent-changed'));
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="mx-auto max-w-3xl bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          We use essential storage to keep the website reliable. Optional analytics help us understand visits and load only with your permission.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/privacy" className="text-xs text-primary hover:underline underline-offset-2">
            Learn More
          </Link>
          <button
            onClick={() => choose('analytics')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Accept analytics
          </button>
          <button onClick={() => choose('necessary')} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Necessary only</button>
        </div>
      </div>
    </div>
  );
}
