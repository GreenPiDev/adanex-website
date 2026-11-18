import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useDevice';
import styles from './ServicesManifesto.module.css';

/**
 * Yaklaşım metni. Satırlar maskesinden sırayla çıkar, arkada hero'daki noktalar EX tabelasına dönüşür.
 */
export function ServicesManifesto() {
  const { t, i18n } = useTranslation('services');
  const prefersReducedMotion = usePrefersReducedMotion();
  // Telefonda hero'da dalga olmadığı için tabela da yoktur (ServicesPage ile aynı koşul).
  const showSign = !useIsMobile();
  const rootRef = useRef<HTMLElement>(null);

  // Satırlar genişlik ve dil değişince yeniden bölünür.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      SplitText.create('[data-manifesto-text]', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: MOTION.slow,
            ease: MOTION.ease,
            stagger: MOTION.stagger * 2,
            scrollTrigger: { trigger: self.lines[0], start: 'top 88%', once: true },
          }),
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.manifesto} data-surface="light">
      {/* Hero'daki altın noktalar metnin arkasında gri EX tabelasına dönüşür. Noktaları sayfadaki DotMorph çizer. */}
      {showSign && <span className={styles.sign} data-dot-shape="ex" data-dot-tone="steel" aria-hidden="true" />}
      <p key={i18n.language} className={styles.text} data-manifesto-text>
        {t('manifesto.text')}
      </p>
    </section>
  );
}
