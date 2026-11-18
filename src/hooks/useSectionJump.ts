import { useCallback } from 'react';
import { useSmoothScroll } from './useSmoothScroll';

/** Sayfadaki bölüme kaydırır ve odağı oraya taşır. Router'a haber verilmez, sayfa içinde perde çalışmaz. */
export function useSectionJump() {
  const lenisRef = useSmoothScroll();

  return useCallback(
    (slug: string) => {
      const element = document.getElementById(slug);
      if (!element) return;

      element.focus({ preventScroll: true });
      const target = element.getBoundingClientRect().top + window.scrollY;

      if (lenisRef.current) lenisRef.current.scrollTo(target, { force: true });
      else window.scrollTo(0, target);
    },
    [lenisRef],
  );
}
