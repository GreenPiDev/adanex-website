import { gsap, MOTION, SplitText } from './gsap';

// Başlık ekrana bu kadar girince açılır.
const REVEAL_START = 'top 88%';

/** Başlık kelimeleri maskesinden çıkar. `useGSAP` içinde çağrılır, font ve dil değişiminde yeniden bölünür. */
export function revealWordsOnScroll(target: HTMLElement) {
  SplitText.create(target, {
    type: 'words',
    mask: 'words',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 130,
        duration: MOTION.slow,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        scrollTrigger: { trigger: target, start: REVEAL_START, once: true },
      }),
  });
}

// Metin bloklarının yerine oturmadan önceki alt payı.
const RISE = 40;

/**
 * Metin bloğu aşağıdan yerine oturur. `data-reveal-items` taşıyan liste kapsayıcısında satırlar sırayla gelir.
 * `useGSAP` içinde çağrılır.
 */
export function revealUpOnScroll(target: HTMLElement) {
  const isList = target.hasAttribute('data-reveal-items');
  gsap.from(isList ? target.children : target, {
    y: RISE,
    autoAlpha: 0,
    duration: MOTION.slow,
    ease: MOTION.ease,
    stagger: isList ? MOTION.stagger * 2 : 0,
    scrollTrigger: { trigger: target, start: REVEAL_START, once: true },
  });
}

/** Kapsam içindeki `data-reveal` ve `data-reveal-items` öğelerini bağlar. */
export function revealMarkedOnScroll() {
  gsap.utils.toArray<HTMLElement>('[data-reveal], [data-reveal-items]').forEach(revealUpOnScroll);
}
