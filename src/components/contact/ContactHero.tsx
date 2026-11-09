import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import { ScrollCue } from '../ui/ScrollCue/ScrollCue';
import { ContactDirectLines } from './ContactDirectLines';
import styles from './ContactHero.module.css';

export function ContactHero() {
  const { t, i18n } = useTranslation();
  const isNavCollapsed = useIsNavCollapsed();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  // Slogan dil değişince yeniden bölünür.
  useGSAP(
    () => {
      if (prefersReducedMotion || !taglineRef.current) return;

      const delay = getPageIntroDelay();
      SplitText.create(taglineRef.current, {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            duration: MOTION.slow,
            ease: MOTION.ease,
            stagger: MOTION.stagger * 2,
            delay: delay + 0.15,
          }),
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('[data-hero-meta]', {
        y: 24,
        autoAlpha: 0,
        duration: MOTION.slow,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        delay: getPageIntroDelay() + 0.25,
      });

      // Form bölümü üstüne binerken hero geriye çekilir. Mobilde doğal scroll hafif kalsın diye yok.
      if (isNavCollapsed) return;
      gsap.to('[data-page-hero-inner]', {
        scale: 0.9,
        autoAlpha: 0.25,
        transformOrigin: '50% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current?.parentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    },
    { scope: rootRef, dependencies: [isNavCollapsed, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <PageHero
      ref={rootRef}
      className={styles.hero}
      title={t('nav.items.contact').toLocaleUpperCase(i18n.language)}
      columns={2}
    >
      <div className={styles.content}>
        <p key={i18n.language} ref={taglineRef} className={styles.tagline}>
          {t('contact.hero.tagline')}
        </p>

        <ContactDirectLines />
      </div>

      <ScrollCue data-hero-meta />
    </PageHero>
  );
}
