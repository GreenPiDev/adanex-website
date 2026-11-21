import { useCallback } from 'react';
import { useSmoothScroll } from './useSmoothScroll';

type JumpOptions = {
  /** Kaydırmadan doğrudan konuma geçer (başka sayfadan bölüm adresiyle gelindiğinde). */
  immediate?: boolean;
};

/** Sayfadaki bölüme kaydırır ve odağı oraya taşır. Router'a haber verilmez, sayfa içinde perde çalışmaz. */
export function useSectionJump() {
  const lenisRef = useSmoothScroll();

  return useCallback(
    (slug: string, { immediate = false }: JumpOptions = {}) => {
      const element = document.getElementById(slug);
      if (!element) return;

      element.focus({ preventScroll: true });
      // Bölümün `scroll-margin-top` payı (ör. header yüksekliği) hedeften düşülür.
      const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
      const target = element.getBoundingClientRect().top + window.scrollY - margin;

      if (lenisRef.current) lenisRef.current.scrollTo(target, { force: true, immediate });
      else window.scrollTo(0, target);
    },
    [lenisRef],
  );
}
