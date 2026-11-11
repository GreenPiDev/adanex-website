import { type CSSProperties, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { SERVICE_PROVINCE_COUNT } from '../../content/services';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import styles from './ProvinceCounter.module.css';

const ROLL_DURATION = 1.8;

/**
 * Her basamak bir sayaç silindiridir. Silindirde rakamlar basamak sırasına göre tekrar eder:
 * sağdaki basamak daha uzun döner, mekanik sayaç gibi görünür. Varsayılan konum son değerdir.
 */
function getDrums(value: number) {
  const digits = Array.from(String(value), Number);
  const cycles = digits.length;

  return digits.map((digit, index) => ({ target: digit + 10 * (cycles - 1 - index), length: 10 * cycles }));
}

type ProvinceCounterProps = {
  className?: string;
};

/** Hero'daki "81 il" bilgisi. Görünür sayı süslemedir, ekran okuyucu tam cümleyi okur. */
export function ProvinceCounter({ className = '' }: ProvinceCounterProps) {
  const { t } = useTranslation('services');
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const drums = getDrums(SERVICE_PROVINCE_COUNT);

  // Hero'da durduğu için scroll beklemez, sayfa girişiyle birlikte döner.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const delay = getPageIntroDelay() + MOTION.fast;

      gsap.utils.toArray<HTMLElement>('[data-drum]').forEach((column, index) => {
        const drum = drums[index];
        if (!drum) return;

        // CSS'teki son konum px olarak okunmasın diye y de sıfırlanır.
        gsap.fromTo(
          column,
          { y: 0, yPercent: 0 },
          {
            y: 0,
            yPercent: (-100 * drum.target) / drum.length,
            duration: ROLL_DURATION,
            ease: MOTION.ease,
            delay: delay + index * MOTION.stagger * 3,
          },
        );
      });

      gsap.from('[data-counter-caption]', {
        y: 24,
        autoAlpha: 0,
        duration: MOTION.slow,
        ease: MOTION.ease,
        delay: delay + MOTION.fast,
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className}>
      <p className={styles.srOnly}>{t('stat.full', { count: SERVICE_PROVINCE_COUNT })}</p>

      <div className={styles.figure} aria-hidden="true">
        <span className={styles.digits}>
          {drums.map(({ target, length }, index) => (
            <span key={index} className={styles.cell}>
              {/* Kutunun genişliği son rakamınkidir. "1" geniş rakamlar kadar yer kaplayıp yazıyı uzaklaştırmaz. */}
              <span className={styles.sizer}>{target % 10}</span>
              <span
                className={styles.drum}
                style={{ '--drum-offset': `${(-100 * target) / length}%` } as CSSProperties}
                data-drum
              >
                {Array.from({ length }, (_, position) => (
                  <span key={position} className={styles.glyph}>
                    {position % 10}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>

        <span className={styles.caption} data-counter-caption>
          {t('stat.caption')}
        </span>
      </div>
    </div>
  );
}
