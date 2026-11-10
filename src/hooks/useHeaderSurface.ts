import { type RefObject, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export type Surface = 'dark' | 'light';
export type HeaderBackdrop = Surface | 'amber';

function isSurface(value: string | undefined): value is Surface {
  return value === 'dark' || value === 'light';
}

/**
 * Header'ın dikey ortasından geçen 1 px'lik çizgiyi izler ve o çizginin üzerindeki
 * `data-surface` bölümünün zeminini döndürür. Sarı bölümler `data-tone="amber"` ile işaretlenir.
 */
export function useHeaderSurface(headerRef: RefObject<HTMLElement | null>): HeaderBackdrop {
  const { pathname } = useLocation();
  const [surface, setSurface] = useState<HeaderBackdrop>('dark');

  useEffect(() => {
    const header = headerRef.current;
    const sections = document.querySelectorAll<HTMLElement>('main [data-surface], footer[data-surface]');
    if (!header || sections.length === 0) return;

    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      const { top, height } = header.getBoundingClientRect();
      const line = Math.round(top + height / 2);

      const intersecting = new Set<Element>();

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          }

          // Yapışık bölümlerin üstüne binen bölüm DOM'da sonra gelir, en üstte görünen odur.
          const top = Array.from(sections).findLast((section) => intersecting.has(section));
          if (top?.dataset.tone === 'amber') setSurface('amber');
          else if (isSurface(top?.dataset.surface)) setSurface(top.dataset.surface);
        },
        { rootMargin: `-${line}px 0px -${Math.max(window.innerHeight - line - 1, 0)}px 0px` },
      );

      sections.forEach((section) => observer?.observe(section));
    };

    observe();
    window.addEventListener('resize', observe);

    return () => {
      window.removeEventListener('resize', observe);
      observer?.disconnect();
    };
  }, [headerRef, pathname]);

  return surface;
}
