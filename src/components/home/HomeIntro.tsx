import { type MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '../../animations/gsap';
import { revealMarkedOnScroll, revealWordsOnScroll } from '../../animations/reveal';
import { recedeWhenCovered } from '../../animations/stack';
import { HOME_CHAPTERS } from '../../content/home';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { useSectionJump } from '../../hooks/useSectionJump';
import { useStickTop } from '../../hooks/useStickTop';
import { RollArrow } from '../ui/RollText/RollText';
import styles from './HomeIntro.module.css';

function formatNumber(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * Firmanın kısa tanımı ve sayfanın içindekiler listesi: üç çözüm numaralı satırlardır,
 * her biri kendi bölümüne kaydırır. Yapışır, ilk çözüm bölümü üstüne biner.
 */
export function HomeIntro() {
  const { t, i18n } = useTranslation('home');
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNavCollapsed = useIsNavCollapsed();
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const jump = useSectionJump();

  useStickTop(rootRef);

  // Çözüm bölümleri ekrana girerken içerik geri çekilir. Telefonda ve dikey tablette yalnızca solar.
  useGSAP(
    () => {
      const inner = innerRef.current;
      const next = rootRef.current?.nextElementSibling;
      if (prefersReducedMotion || !inner || !next) return;
      recedeWhenCovered(inner, next, { fadeOnly: isNavCollapsed });
    },
    { scope: rootRef, dependencies: [isNavCollapsed, prefersReducedMotion], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('[data-intro-statement]').forEach(revealWordsOnScroll);
      revealMarkedOnScroll();
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    jump(slug);
  };

  return (
    <section ref={rootRef} className={styles.intro} data-surface="light">
      <div ref={innerRef} className={styles.inner}>
        <p key={i18n.language} className={styles.statement} data-intro-statement>
          {t('intro.statement')}
        </p>

        <div className={styles.columns}>
          <p className={styles.body} data-reveal>{t('intro.body')}</p>

          <nav className={styles.index} aria-label={t('intro.indexLabel')}>
            <ol className={styles.list} data-reveal-items>
              {HOME_CHAPTERS.map(({ key, slug }, index) => (
                <li key={key}>
                  <a className={styles.link} href={`#${slug}`} onClick={(event) => handleClick(event, slug)}>
                    <span className={styles.number} aria-hidden="true">
                      {formatNumber(index + 1)}
                    </span>
                    <span className={styles.name}>{t(`chapters.${key}.name`)}</span>
                    <RollArrow />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
