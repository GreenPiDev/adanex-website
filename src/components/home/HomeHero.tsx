import { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import styles from './HomeHero.module.css';

const HERO_VIDEO_SRC = '/home-hero.mp4';
const HERO_POSTER_SRC = '/home-hero-poster.webp';

/**
 * Ana sayfanın girişi: tam ekran ürün videosu, altta zemine eriyen gölgenin üstünde slogan,
 * yanında kısa açıklama. İletişime çağrı sayfanın sonundadır.
 */
export function HomeHero() {
  const { t, i18n } = useTranslation('home');
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Azaltılmış hareket tercihinde video durur ve poster karesi görünür.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }
    // Tarayıcı otomatik oynatmayı engellerse poster karesi kalır.
    video.play().catch(() => undefined);
  }, [prefersReducedMotion]);

  // Slogan dil değişince yeniden bölünür. Ardından açıklama aşağıdan yerine oturur.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const delay = getPageIntroDelay();
      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      SplitText.create('[data-hero-title]', {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.words, { yPercent: 130, ...motion, stagger: MOTION.stagger, delay }),
      });

      gsap.from('[data-hero-reveal]', {
        y: 32,
        autoAlpha: 0,
        ...motion,
        delay: delay + MOTION.base,
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.hero} data-surface="dark">
      {/* Dekoratif arka plan videosu: sessiz, bir kez oynar ve son karede kalır, ekran okuyuculardan gizli. */}
      <video
        ref={videoRef}
        className={styles.video}
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER_SRC}
        autoPlay={!prefersReducedMotion}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className={styles.content}>
        <h1 key={i18n.language} className={styles.title} data-hero-title>
          <Trans t={t} i18nKey="hero.title" components={{ accent: <span className={styles.accent} /> }} />
        </h1>

        <div className={styles.aside}>
          <p className={styles.lead} data-hero-reveal>
            {t('hero.lead')}
          </p>
        </div>
      </div>

      <ScrollCue className={styles.cue} />
    </section>
  );
}
