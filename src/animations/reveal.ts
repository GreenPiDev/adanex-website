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
