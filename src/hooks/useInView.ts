"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -80px 0px",
  threshold: 0.1,
};

/**
 * Returns a ref and whether the element is in view.
 * Use with .section-enter and .section-enter.visible for scroll-triggered animations.
 */
export function useInView(options: Partial<IntersectionObserverInit> = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const opts = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setIsInView(true);
    }, opts);

    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.root, opts.rootMargin, opts.threshold]);

  return { ref, isInView };
}
