import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { gsap, useGSAP } from '../../animations/gsap';
import { revealWordsOnScroll } from '../../animations/reveal';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ServicesClosing.module.css';

/** Hattın vardığı yer: iletişime çağrı ve Zone uyarısı. Ürün önermez, uzman değerlendirmesine yönlendirir. */
export function ServicesClosing() {
  const { t, i18n } = useTranslation('services');
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const contactPath = localizePath('/contact', getLocaleFromPathname(pathname));

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('[data-closing-title]').forEach(revealWordsOnScroll);
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.closing} data-surface="light" data-tone="amber">
      <h2 key={i18n.language} className={styles.title} data-closing-title>
        {t('closing.title')}
      </h2>

      <div className={styles.footer}>
        <Link className={styles.cta} to={contactPath}>
          <RollText text={t('closing.cta').toLocaleUpperCase(i18n.language)} />
          <RollArrow />
        </Link>
        <p className={styles.note}>{t('closing.note')}</p>
      </div>
    </section>
  );
}
