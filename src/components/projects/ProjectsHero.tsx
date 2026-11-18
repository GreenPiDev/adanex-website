import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInspectCursor } from '../ui/CustomCursor/useInspectCursor';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import styles from './ProjectsHero.module.css';

const MIN_BENTO_SCALE = 0.5;
const MAX_BENTO_SCALE = 1.4;
const FIT_STEPS = 8;

// Hero görseli: karoların sağında kare tanıtım afişi. Dar ekranda hiç yüklenmez, karolar yüksekliğe ölçülerek sığar.
const HERO_VISUAL = { src: '/anasayfa-1.webp', width: 1254, height: 1254 } as const;

/**
 * Mobilde ve görselli geniş ekranda kart grubu başlığın harf kenarlarıyla aynı yüksekliktedir, kartlar ise yazıları kadar uzar.
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
  const inspectCursor = useInspectCursor();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const hasVisual = !useIsNavCollapsed();
  const [isVisualOpen, setIsVisualOpen] = useState(false);

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

      // Karolar ekranın solundan, görsel sağından kayarak gelir.
      const slide = { autoAlpha: 0, duration: MOTION.slow * 1.5, ease: MOTION.ease, delay };
      gsap.from('[data-bento-tile]', { x: '-40vw', stagger: MOTION.stagger * 2, ...slide });
      gsap.from('[data-bento-visual]', { x: '40vw', ...slide });

      SplitText.create(gsap.utils.toArray<HTMLElement>('[data-bento-text]'), {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 130, ...motion, delay: delay + 0.15 }),
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion, hasVisual], revertOnUpdate: true },
  );

  const visualAlt = t('projects.hero.visual');

  return (
    <PageHero ref={rootRef} className={styles.hero} title={t('nav.items.projects').toLocaleUpperCase(i18n.language)}>
      <div className={hasVisual ? `${styles.bento} ${styles.withVisual}` : styles.bento}>
        {/* Ölçülen alan yalnızca karolardır; görsel yanında ayrı durur. */}
        <div ref={bentoRef} className={styles.tiles}>
          <div className={`${styles.tile} ${styles.first}`} data-bento-tile>
            <p key={i18n.language} className={styles.text} data-bento-text>
              {t('projects.hero.lead')}
            </p>
          </div>

          {/* Sarı karo cümleden çıkan vurgudur, ekran okuyucuda tekrar edilmez. */}
          <div className={`${styles.tile} ${styles.second}`} data-bento-tile aria-hidden="true">
            <p key={i18n.language} className={styles.text} data-bento-text>
              {t('projects.hero.bento.products').toLocaleUpperCase(i18n.language)}
            </p>
          </div>
        </div>

        {hasVisual && (
          <figure className={styles.visual} data-bento-visual>
            <span className={styles.media}>
              <img
                className={styles.image}
                src={HERO_VISUAL.src}
                width={HERO_VISUAL.width}
                height={HERO_VISUAL.height}
                alt={visualAlt}
                decoding="async"
              />
            </span>
            <button
              className={styles.zoom}
              {...inspectCursor}
              type="button"
              aria-label={t('projects.openImage', { title: visualAlt })}
              onClick={() => setIsVisualOpen(true)}
            />
          </figure>
        )}
      </div>

      <ScrollCue className={styles.cue} />

      {isVisualOpen && <Lightbox src={HERO_VISUAL.src} alt={visualAlt} onClose={() => setIsVisualOpen(false)} />}
    </PageHero>
  );
}
