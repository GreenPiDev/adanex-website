import { type MouseEvent, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { formatStageNumber, SERVICE_HERO_IMAGE, SERVICE_STATIONS } from '../../content/services';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import { RollText } from '../ui/RollText/RollText';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import { ProvinceCounter } from './ProvinceCounter';
import styles from './ServicesHero.module.css';
import { useStationJump } from './useStationJump';

/** Aşağıyı gösteren ok: kart sayfa içinde aşağıdaki aşamaya götürür. */
function DownArrow() {
  return (
    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v16M5 13l7 7 7-7" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

/** Sayfanın girişi: başlık cümlesi ve görseli, aşamalara götüren dört dikey kart ve 81 il sayacı. */
export function ServicesHero() {
  const { t, i18n } = useTranslation('services');
  const { t: tCommon } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  // Telefonda kolon dar ve kısadır, görsel ve dalga sığmaz. Hiç kurulmadıkları için dosya inmez, tuval çalışmaz.
  const showImage = !useIsMobile();
  const rootRef = useRef<HTMLElement>(null);
  const jump = useStationJump();

  // Cümle dil değişince yeniden bölünür. Kartlar sayaçla birlikte sırayla yerine oturur.
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

      // Görsel hafif büyükten yerine oturur.
      if (showImage) {
        gsap.from('[data-hero-image]', { scale: 1.15, ...motion, duration: MOTION.slow * 1.5, delay });
        gsap.from('[data-hero-frame]', { autoAlpha: 0, ...motion, delay });
      }

      gsap.from('[data-stage-card]', {
        y: 32,
        autoAlpha: 0,
        ...motion,
        stagger: MOTION.stagger * 2,
        delay: delay + MOTION.fast,
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion, showImage], revertOnUpdate: true },
  );

  const handleCardClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    jump(slug);
  };

  return (
    <PageHero
      ref={rootRef}
      className={styles.hero}
      title={tCommon('nav.items.services').toLocaleUpperCase(i18n.language)}
    >
      <div className={styles.panel}>
        <div className={`${styles.intro} ${showImage ? styles.introWithImage : ''}`}>
          <p key={i18n.language} className={styles.statement} data-hero-statement>
            <Trans t={t} i18nKey="hero.statement" components={{ accent: <span className={styles.accent} /> }} />
          </p>

          {showImage && (
            <figure className={styles.figure}>
              <span className={styles.frame} data-hero-frame>
                <span className={styles.unskew}>
                  <img
                    className={styles.image}
                    src={SERVICE_HERO_IMAGE.src}
                    width={SERVICE_HERO_IMAGE.width}
                    height={SERVICE_HERO_IMAGE.height}
                    alt={t('hero.imageAlt')}
                    decoding="async"
                    fetchPriority="high"
                    data-hero-image
                  />
                </span>
              </span>
            </figure>
          )}
        </div>

        <div className={styles.lower}>
          <nav className={styles.stages} aria-label={t('hero.routeLabel')}>
            <ol className={styles.cards}>
              {SERVICE_STATIONS.map(({ key, slug, cardImage }, index) => (
                <li key={key} className={styles.cardItem} data-stage-card>
                  <a className={styles.card} href={`#${slug}`} onClick={(event) => handleCardClick(event, slug)}>
                    {/* Arka plan görseli dekoratiftir, kartın adı zaten metin olarak okunur. */}
                    <img className={styles.cardImage} src={cardImage} alt="" decoding="async" aria-hidden="true" />
                    <RollText className={styles.cardNumber} text={formatStageNumber(index + 1)} />
                    <RollText className={styles.cardLabel} text={t(`stations.${key}.short`)} />
                    <span className={styles.arrow}>
                      <DownArrow />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Dalga sayacın satırından kartların alt kenarını biraz geçecek kadar yukarı, hero'nun altına kadar aşağı uzanır. */}
          <div className={styles.counterRow}>
            {/* Dalganın alanı. Noktaları sayfadaki DotMorph çizer. */}
            {showImage && <span className={styles.wave} data-wave-anchor aria-hidden="true" />}
            <ProvinceCounter className={styles.counter} />
          </div>
        </div>
      </div>

      <ScrollCue className={styles.cue} />
    </PageHero>
  );
}
