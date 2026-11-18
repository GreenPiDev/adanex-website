import { type RefObject, useLayoutEffect } from 'react';

/**
 * Yapışık bölümün yapışma payını `--stick-top` olarak verir. Ekrana sığan bölüm üstten yapışır (0), ekrandan uzun
 * bölüm ise alt kenarı ekranın altına gelince yapışır; böylece içeriğinin tamamı okunmadan üstü örtülmez.
 */
export function useStickTop(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      element.style.setProperty('--stick-top', `${Math.min(0, window.innerHeight - element.offsetHeight)}px`);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);
}
