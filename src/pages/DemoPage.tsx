import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDevice, usePrefersReducedMotion } from '../hooks/useDevice';
import styles from './DemoPage.module.css';

const SURFACES = ['dark', 'light'] as const;

const HERO_VIDEO_SRC = '/home-hero.mp4';
const HERO_POSTER_SRC = '/home-hero-poster.webp';

/** Geçici test sayfası: header'ın zemine göre renk değişimini ve cihaz hook'larını gösterir. */
export function DemoPage() {
  const { t } = useTranslation();
  const device = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
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

  return (
    <>
      {SURFACES.map((surface) => (
        <section
          key={surface}
          className={`${styles.section} ${surface === 'dark' ? styles.hero : ''}`}
          data-surface={surface}
        >
          {surface === 'dark' && (
            // Dekoratif arka plan videosu: sessiz, bir kez oynar ve son karede kalır, ekran okuyuculardan gizli.
            <video
              ref={videoRef}
              className={styles.heroVideo}
              src={HERO_VIDEO_SRC}
              poster={HERO_POSTER_SRC}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
          <p className={styles.eyebrow}>{t(`demo.${surface}.eyebrow`)}</p>
          <h1 className={styles.title}>{t(`demo.${surface}.title`)}</h1>
          <p className={styles.device}>{t('demo.detectedDevice', { device: t(`device.${device}`) })}</p>
        </section>
      ))}
    </>
  );
}
