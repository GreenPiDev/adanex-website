import { gsap } from './gsap';

// Üstüne bölüm binerken içerik bu kadar küçülür ve solar (Çalışmalarımız'daki dosyalarla aynı değerler).
const RECEDE_SCALE = 0.92;
const RECEDE_OPACITY = 0.25;

/**
 * Yapışık bölümün içeriği, sıradaki bölüm ekrana girip üstüne binerken geri çekilir. Bölümün zemini yerinde kalır,
 * yalnızca içerik katmanı küçülüp solar. `fadeOnly` ile (telefon ve dikey tablet) yalnızca solar: ekrandan uzun
 * bölümde küçülme kenarlarda boşluk açar. `useGSAP` içinde çağrılır.
 */
export function recedeWhenCovered(inner: HTMLElement, cover: Element, { fadeOnly = false } = {}) {
  gsap.to(inner, {
    ...(fadeOnly ? {} : { scale: RECEDE_SCALE, transformOrigin: '50% 100%' }),
    autoAlpha: RECEDE_OPACITY,
    ease: 'none',
    scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top top', scrub: true },
  });
}
