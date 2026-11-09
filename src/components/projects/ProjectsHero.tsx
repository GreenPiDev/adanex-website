import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import styles from './ProjectsHero.module.css';

const MIN_BENTO_SCALE = 0.5;
const MAX_BENTO_SCALE = 1.4;
const FIT_STEPS = 8;

/**
 * Mobilde kart grubu başlığın harf kenarlarıyla aynı yüksekliktedir, kartlar ise yazıları kadar uzar.
 * Satır sayısı genişliğe ve dile bağlı olduğu için bu yüksekliğe sığan en büyük yazı boyutu ölçülerek bulunur.
 */
function fitBento(bento: HTMLElement) {
  const style = getComputedStyle(bento);

  if (style.getPropertyValue('--bento-fit').trim() !== '1') {
    bento.style.removeProperty('--bento-scale');
    return;
  }

  const tiles = Array.from(bento.querySelectorAll<HTMLElement>('[data-bento-tile]'));
  const gaps = (Number.parseFloat(style.rowGap) || 0) * (tiles.length - 1);

  const fits = (scale: number) => {
    bento.style.setProperty('--bento-scale', String(scale));
    return tiles.reduce((total, tile) => total + tile.offsetHeight, gaps) <= bento.clientHeight;
  };

  let low = MIN_BENTO_SCALE;
  let high = MAX_BENTO_SCALE;

  for (let step = 0; step < FIT_STEPS; step += 1) {
    const middle = (low + high) / 2;
    if (fits(middle)) low = middle;
    else high = middle;
  }

  fits(low);
}

export function ProjectsHero() {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  // Başlık boyu ekranla ve fontla değiştiği için ölçüm bunlara göre yenilenir.
  useLayoutEffect(() => {
    const bento = bentoRef.current;
    if (!bento) return;

    const fit = () => fitBento(bento);
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(bento);
    document.fonts.addEventListener('loadingdone', fit);

    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [i18n.language]);

  // Karo yazıları dil değişince yeniden bölünür.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const delay = getPageIntroDelay();
      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      gsap.from('[data-bento-tile]', { y: 48, autoAlpha: 0, ...motion, delay });

      SplitText.create(gsap.utils.toArray<HTMLElement>('[data-bento-text]'), {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 130, ...motion, delay: delay + 0.15 }),
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <PageHero ref={rootRef} className={styles.hero} title={t('nav.items.projects').toLocaleUpperCase(i18n.language)}>
      <div ref={bentoRef} className={styles.bento}>
        <div className={`${styles.tile} ${styles.first}`} data-bento-tile>
          <p key={i18n.language} className={styles.text} data-bento-text>
            {t('projects.hero.lead')}
          </p>
        </div>

        {/* Alttaki karolar cümleden çıkan vurgular olduğu için ekran okuyucuda tekrar edilmez. */}
        <div className={`${styles.tile} ${styles.second}`} data-bento-tile aria-hidden="true">
          <p key={i18n.language} className={styles.text} data-bento-text>
            {t('projects.hero.bento.products').toLocaleUpperCase(i18n.language)}
          </p>
        </div>

        <div className={`${styles.tile} ${styles.third}`} data-bento-tile aria-hidden="true">
          <p key={i18n.language} className={styles.text} data-bento-text>
            {t('projects.hero.bento.approach')}
          </p>
        </div>
      </div>

      <ScrollCue className={styles.cue} />
    </PageHero>
  );
}
