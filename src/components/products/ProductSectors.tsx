import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { gsap, useGSAP } from '../../animations/gsap';
import { revealMarkedOnScroll, revealWordsOnScroll } from '../../animations/reveal';
import { SECTOR_KEYS } from '../../content/products';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ProductSectors.module.css';

/**
 * Kapanış: ürünlerin çalıştığı sahalar eğik çizgiyle ayrılmış tek bir yazı bloğudur (bilgi merkezindeki tesis
 * listesiyle aynı biçim). Altında iletişime çağrı ve Zone uyarısı durur. Ürün önermez, uzman değerlendirmesine yönlendirir.
 */
export function ProductSectors() {
  const { t, i18n } = useTranslation('products');
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const locale = getLocaleFromPathname(pathname);
  const upper = (text: string) => text.toLocaleUpperCase(i18n.language);

  // Giriş cümlesi kelime kelime açılır, saha listesi ile çağrı ve uyarı ardından aşağıdan yerine oturur.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.utils.toArray<HTMLElement>('[data-sectors-lead]').forEach(revealWordsOnScroll);
      revealMarkedOnScroll();
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.sectors} data-surface="light" data-tone="amber">
      {/* Bölümün başlığı giriş cümlesidir. */}
      <h2 key={i18n.language} className={styles.lead} data-sectors-lead>
        {t('sectors.lead')}
      </h2>

      <ul className={styles.list} aria-label={t('sectors.listLabel')} data-reveal>
        {SECTOR_KEYS.map((key) => (
          <li key={key} className={styles.sector}>
            {t(`sectors.items.${key}`)}
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <Link className={styles.cta} to={localizePath('/contact', locale)} data-reveal>
          <RollText className={styles.ctaText} text={upper(t('sectors.cta'))} />
          <RollArrow />
        </Link>
        <p className={styles.note} data-reveal>
          {t('sectors.note')}
        </p>
      </div>
    </section>
  );
}
