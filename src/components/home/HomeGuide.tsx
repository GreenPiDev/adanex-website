import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { gsap, useGSAP } from '../../animations/gsap';
import { revealMarkedOnScroll, revealWordsOnScroll } from '../../animations/reveal';
import { GUIDE_FREQUENCIES, GUIDE_ZONES, ZONE_TERM } from '../../content/home';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './HomeGuide.module.css';

/**
 * Teknik bilgi merkezine köprü: ürün seçmeden önce bölgenin tanınması gerektiğini söyleyen kısa metin ve Zone
 * matrisi (satırlar gaz ve toz, sütunlar oluşma sıklığı). Her hücre bilgi merkezinde o Zone'u anlatan maddeye gider.
 * Ürün önermez.
 */
export function HomeGuide() {
  const { t, i18n } = useTranslation('home');
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const knowledgePath = localizePath('/knowledge-center', getLocaleFromPathname(pathname));
  const zoneTerm = ZONE_TERM.toLocaleUpperCase(i18n.language);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('[data-guide-title]').forEach(revealWordsOnScroll);
      revealMarkedOnScroll();
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.guide} data-surface="light" aria-labelledby="home-guide-title">
      <div className={styles.copy}>
        <p className={styles.label} data-reveal>
          {t('guide.label').toLocaleUpperCase(i18n.language)}
        </p>
        <h2 key={i18n.language} id="home-guide-title" className={styles.title} data-guide-title>
          {t('guide.title')}
        </h2>
        <p className={styles.body} data-reveal>
          {t('guide.body')}
        </p>
        <Link className={styles.link} to={knowledgePath} data-reveal>
          <RollText text={t('guide.link').toLocaleUpperCase(i18n.language)} />
          <RollArrow />
        </Link>
      </div>

      <table className={styles.matrix} aria-label={t('guide.zonesLabel')} data-reveal>
        <thead>
          <tr>
            <td className={styles.corner} />
            {GUIDE_FREQUENCIES.map((frequency) => (
              <th key={frequency} className={styles.colHead} scope="col">
                {t(`guide.frequency.${frequency}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GUIDE_ZONES.map(({ medium, zones }) => (
            <tr key={medium}>
              <th className={styles.rowHead} scope="row">
                {t(`guide.media.${medium}`)}
              </th>
              {zones.map(({ zone, slug }) => (
                <td key={zone} className={styles.cellWrap}>
                  <Link
                    className={styles.cell}
                    to={`${knowledgePath}#${slug}`}
                    aria-label={t('guide.zoneLink', { zone })}
                  >
                    <span className={styles.zoneWord} aria-hidden="true">
                      {zoneTerm}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <RollArrow />
                    </span>
                    <span className={styles.zoneNumber} aria-hidden="true">
                      {zone}
                    </span>
                  </Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
