import { type MouseEvent, useCallback, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { PRODUCT_FAMILIES } from '../../content/about';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { PageHero } from '../layout/PageHero/PageHero';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import styles from './AboutHero.module.css';
import { useAboutCopy } from './useAboutCopy';

/** Ürün gamındaki satıra kaydırır ve odağı oraya taşır. Satırın üst boşluğu header kadardır (scroll-margin-top). */
function useFamilyJump() {
  const lenisRef = useSmoothScroll();

  return useCallback(
    (slug: string) => {
      const element = document.getElementById(slug);
      if (!element) return;

      element.focus({ preventScroll: true });
      const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
      const target = element.getBoundingClientRect().top + window.scrollY - offset;

      if (lenisRef.current) lenisRef.current.scrollTo(target, { force: true });
      else window.scrollTo(0, target);
    },
    [lenisRef],
  );
}

// Hero görseli: tanıtım afişi kolonu doldurur. Dar ekranda hiç yüklenmez.
const HERO_VISUALS = [{ key: 'poster', src: '/a1.webp' }] as const;

const HERO_VISUAL_SIZE = { width: 1024, height: 1536 } as const;

/**
 * Sayfanın girişi: üstte slogan, altta firmayı anlatan kısa giriş ve beş ürün ailesi.
 * Aileler eğik çizgiyle ayrılmış bağlantılardır, her biri ürün gamındaki kendi satırına götürür.
 */
export function AboutHero() {
  const { t, i18n } = useTranslation('about');
  const { t: tCommon } = useTranslation();
  const { ledger } = useAboutCopy();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const jump = useFamilyJump();
  const hasVisuals = !useIsNavCollapsed();
  const [openVisual, setOpenVisual] = useState<(typeof HERO_VISUALS)[number] | null>(null);

  // Slogan dil değişince yeniden bölünür. Ardından paragraf ve aileler sırayla aşağıdan yerine oturur.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const delay = getPageIntroDelay();
      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      SplitText.create('[data-hero-statement]', {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 130, ...motion, stagger: MOTION.stagger, delay }),
      });

      gsap.from('[data-hero-reveal]', {
        y: 32,
        autoAlpha: 0,
        ...motion,
        stagger: MOTION.stagger * 3,
        delay: delay + MOTION.base,
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  const handleFamilyClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    jump(slug);
  };

  return (
    <PageHero
      ref={rootRef}
      className={styles.hero}
      title={tCommon('nav.items.about').toLocaleUpperCase(i18n.language)}
    >
      <div className={hasVisuals ? `${styles.panel} ${styles.withVisuals}` : styles.panel}>
        <div className={styles.copy}>
          <p key={i18n.language} className={styles.statement} data-hero-statement>
            <Trans t={t} i18nKey="hero.statement" components={{ accent: <span className={styles.accent} /> }} />
          </p>

          <p className={styles.intro} data-hero-reveal>
            {t('hero.intro')}
          </p>

          <nav className={styles.nav} aria-label={t('hero.familiesLabel')} data-hero-reveal>
            <ul className={styles.families}>
              {PRODUCT_FAMILIES.map(({ key, slug }) => (
                <li key={key} className={styles.family}>
                  <a className={styles.familyLink} href={`#${slug}`} onClick={(event) => handleFamilyClick(event, slug)}>
                    {ledger.families[key].name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {hasVisuals && (
          <div className={styles.visuals}>
            {HERO_VISUALS.map((visual) => (
              <figure key={visual.key} className={`${styles.visual} ${styles.primary}`} data-hero-reveal>
                <span className={styles.media}>
                  <img
                    className={styles.image}
                    src={visual.src}
                    alt={t(`hero.visuals.${visual.key}`)}
                    width={HERO_VISUAL_SIZE.width}
                    height={HERO_VISUAL_SIZE.height}
                    decoding="async"
                  />
                </span>
                <button
                  className={styles.zoom}
                  type="button"
                  aria-label={tCommon('projects.openImage', { title: t(`hero.visuals.${visual.key}`) })}
                  onClick={() => setOpenVisual(visual)}
                />
              </figure>
            ))}
          </div>
        )}
      </div>

      <ScrollCue className={styles.cue} />

      {openVisual && (
        <Lightbox src={openVisual.src} alt={t(`hero.visuals.${openVisual.key}`)} onClose={() => setOpenVisual(null)} />
      )}
    </PageHero>
  );
}
