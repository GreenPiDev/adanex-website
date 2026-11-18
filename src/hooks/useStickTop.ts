import { type RefObject, useLayoutEffect } from 'react';

/**
 * Yapışık bölümün yapışma payını `--stick-top` olarak verir. Ekrana sığan bölüm üstten yapışır (0), ekrandan uzun
 * bölüm ise alt kenarı ekranın altına gelince yapışır; böylece içeriğinin tamamı okunmadan üstü örtülmez.
 * Ekran yüksekliği JS'te ölçülmez, CSS'te `100svh` olarak kalır: telefonda adres çubuğu açılıp kapanırken
 * `innerHeight` değişir ve pay yeniden hesaplanırsa yapışık bölüm zıplar. Yalnızca bölümün boyu ölçülür.
 */
export function useStickTop(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Genişlik değişince bölümün boyu da değiştiği için ResizeObserver yeterlidir.
    const observer = new ResizeObserver(() => {
      element.style.setProperty('--stick-top', `min(0px, calc(100svh - ${element.offsetHeight}px))`);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
