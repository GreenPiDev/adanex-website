import '@fontsource/barlow-semi-condensed/600.css';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { gsap, MOTION, useGSAP } from '../animations/gsap';
import { getPageIntroDelay } from '../animations/pageIntro';
import { PageHero } from '../components/layout/PageHero/PageHero';
import { RollArrow, RollText } from '../components/ui/RollText/RollText';
import { usePrefersReducedMotion } from '../hooks/useDevice';
import { getLocaleFromPathname, localizePath } from '../i18n/locale';
import styles from './NotFoundPage.module.css';

const ACTIONS = [
  { key: 'home', path: '/' },
  { key: 'contact', path: '/contact' },
] as const;

export function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  const prefersReducedMotion = usePrefersReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('[data-not-found-reveal]', {
        y: 32,
        autoAlpha: 0,
        duration: MOTION.slow,
        ease: MOTION.ease,
        stagger: MOTION.stagger * 2,
        delay: getPageIntroDelay() + 0.25,
      });
    },
    { scope: contentRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <>
      {/* Sunucu her adrese 200 döndüğü için arama motorlarına burada bildirilir. */}
      <meta name="robots" content="noindex" />

      <PageHero title={t('notFound.code')}>
        <div ref={contentRef} className={styles.content}>
          <p className={styles.label} data-not-found-reveal>
            {t('notFound.label').toLocaleUpperCase(i18n.language)}
          </p>
          <p className={styles.message} data-not-found-reveal>
            {t('notFound.message')}
          </p>

          <ul className={styles.actions}>
            {ACTIONS.map(({ key, path }) => (
              <li key={key} data-not-found-reveal>
                <Link className={styles.action} to={localizePath(path, locale)}>
                  <RollText text={t(`nav.items.${key}`)} />
                  <RollArrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageHero>
    </>
  );
}
