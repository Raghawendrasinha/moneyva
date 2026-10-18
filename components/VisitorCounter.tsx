
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/components/PreferencesProvider";

export default function VisitorCounter() {
  const pathname = usePathname();
  const { language } = usePreferences();
  const [count, setCount] = useState<number | null>(null);
  const countedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || countedPath.current === pathname) return;

    // Prevent duplicate counting from React Strict Mode in development.
    countedPath.current = pathname;

    let cancelled = false;

    fetch("/api/visitor-count", {
      method: "POST",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Visitor count request failed");
        }

        return response.json();
      })
      .then((data: { count: number }) => {
        if (!cancelled && Number.isFinite(data.count)) {
          setCount(data.count);
        }
      })
      .catch(() => {
        // A counter failure should never break the footer or page.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const label =
    language === "hi" ? "कुल पेज व्यू" : "Total page views";

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
      aria-live="polite"
    >
      <span aria-hidden="true">👁</span>
      <span>{label}:</span>
      <span className="font-medium tabular-nums">
        {count === null ? "—" : count.toLocaleString("en-IN")}
      </span>
    </span>
  );
}
