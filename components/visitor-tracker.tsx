"use client";

import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    // Track visitor on mount
    const trackVisit = async () => {
      try {
        await fetch("/api/visitor/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
