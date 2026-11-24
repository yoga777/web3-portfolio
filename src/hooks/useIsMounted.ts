"use client";

import { useEffect, useState } from "react";

/**
 * Hydration safety (PRD 5.1): wallet state only exists in the browser, so
 * components depending on it render a stable placeholder until mounted.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
