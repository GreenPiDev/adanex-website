import { type CSSProperties, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, useGSAP } from '../../animations/gsap';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useDevice';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import styles from './ChapterPhoto.module.css';

/** Fotoğrafın kendisi: yol, gerçek piksel ölçüsü ve açıklaması. */
export type ChapterPhotoSource = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type ChapterPhotoProps = ChapterPhotoSource & {
  /** Büyütme düğmesinin erişilebilir adında geçen kısa ad (ör. "Kablo rakorları"). */
  name: string;
  /** Geniş ekranda fotoğrafın boyu bulunduğu alanın yüksekliğine eşitlenir, genişliği orandan gelir. */
  fitHeight?: boolean;
};

/**
 * Bölümün yanındaki ürün fotoğrafı. Ekrana gelince üstündeki sarı perde yukarı toplanır,
 * fotoğraf hafif büyükten yerine oturur. Ardından sayfa kaydıkça çerçeveyle birlikte metinden biraz yavaş kayar.
 * Çerçeve fotoğrafın oranındadır, fotoğraf kırpılmaz. Kayma, altındaki içeriğe değmeyecek kadar küçüktür. Telefonda yalnızca açılış çalışır, kayma yoktur. Tıklanınca tam ekran açılır (Hakkımızda'daki gibi).
 */
export function ChapterPhoto({ src, width, height, alt, name, fitHeight = false }: ChapterPhotoProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const root = rootRef.current;
      if (!root) return;
      // Fotoğraf kaydırmayla yer değiştirdiği için ölçüm, durduğu kolondan yapılır.
      const trigger = root.parentElement ?? root;

      gsap
        .timeline({
          scrollTrigger: { trigger, start: 'top 80%', once: true },
          defaults: { ease: MOTION.ease, duration: MOTION.slow * 1.6 },
        })
        .fromTo('[data-photo-cover]', { scaleY: 1 }, { scaleY: 0 })
        .from('[data-photo-image]', { scale: 1.25 }, 0);

      if (isMobile) return;

      gsap.fromTo(
        root,
        { y: -16 },
        {
          y: 16,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { scope: rootRef, dependencies: [prefersReducedMotion, isMobile], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={`${styles.group} ${fitHeight ? styles.fitHeight : ''}`} style={{ '--photo-ratio': width / height } as CSSProperties}>
      <figure className={styles.photo}>
        <div className={styles.frame}>
          <div className={styles.zoomLayer}>
            <img
              className={styles.image}
              src={src}
              width={width}
              height={height}
              alt={alt}
              loading="lazy"
              decoding="async"
              data-photo-image
            />
          </div>
          <div className={styles.cover} data-photo-cover aria-hidden="true" />
        </div>
        <button
          className={styles.zoom}
          type="button"
          aria-label={t('projects.openImage', { title: name })}
          onClick={() => setIsOpen(true)}
        />
      </figure>
      {isOpen && <Lightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />}
    </div>
  );
}
