import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInspectCursor } from '../ui/CustomCursor/useInspectCursor';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import styles from './ProjectsHero.module.css';

// Hero görseli: yazıların sağında kare tanıtım afişi. Dar ekranda hiç yüklenmez.
const HERO_VISUAL = { src: '/anasayfa-1.webp', width: 1254, height: 1254 } as const;

export function ProjectsHero() {
  const { t, i18n } = useTranslation();
  const inspectCursor = useInspectCursor();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const hasVisual = !useIsNavCollapsed();
  const [isVisualOpen, setIsVisualOpen] = useState(false);

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
        <div className={styles.tiles}>
          {/* Giriş cümlesi kart değildir, sarı vurgunun altında düz metin olarak durur. */}
          <p key={i18n.language} className={styles.lead} data-bento-tile data-bento-text>
            {t('projects.hero.lead')}
          </p>

          {/* Sarı vurgu cümleden çıkar, ekran okuyucuda tekrar edilmez. */}
          <div className={styles.second} data-bento-tile aria-hidden="true">
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
