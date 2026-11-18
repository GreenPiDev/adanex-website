import { gsap } from './gsap';

// Üstüne bölüm binerken içerik bu kadar küçülür ve solar (Çalışmalarımız'daki dosyalarla aynı değerler).
const RECEDE_SCALE = 0.92;
const RECEDE_OPACITY = 0.25;

/**
 * Yapışık bölümün içeriği, sıradaki bölüm ekrana girip üstüne binerken geri çekilir. Bölümün zemini yerinde kalır,
 * yalnızca içerik katmanı küçülüp solar. `useGSAP` içinde çağrılır.
 */
export function recedeWhenCovered(inner: HTMLElement, cover: Element) {
  gsap.to(inner, {
    scale: RECEDE_SCALE,
    autoAlpha: RECEDE_OPACITY,
    transformOrigin: '50% 100%',
    ease: 'none',
    scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top top', scrub: true },
  });
}
