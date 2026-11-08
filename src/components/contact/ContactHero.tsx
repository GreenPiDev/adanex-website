import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { CONTACT } from '../../content/contact';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { PageHero } from '../layout/PageHero/PageHero';
import styles from './ContactHero.module.css';

function LocalClock({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date());
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: CONTACT.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
    [locale],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <time className={`${styles.value} ${styles.clock}`}>{formatter.format(now)}</time>;
}

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

      // Sarı bölüm üstüne binerken hero geriye çekilir. Mobilde doğal scroll hafif kalsın diye yok.
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

  // Harf sayısı dile göre değiştiği için silindirler dil değişince yeniden kurulur.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: MOTION.scrollCuePause,
        delay: getPageIntroDelay(),
      });
      const drums = gsap.utils.toArray<HTMLElement>('[data-scroll-cue-drum]');
      const step = { duration: MOTION.scrollCueStep, ease: MOTION.ease, stagger: MOTION.scrollCueStagger };
      const stepLength = MOTION.scrollCueStep + MOTION.scrollCueStagger * (drums.length - 1);
      const secondStepStart = stepLength + MOTION.scrollCuePause;

      // Çizgi her harf dönüşüyle aynı anda başlar ve biter.
      const runnerPass = { yPercent: 100, duration: stepLength, ease: MOTION.ease };

      // Son kopya ilk haliyle aynı olduğu için döngü başa dönerken sıçrama olmaz.
      timeline
        .to(drums, { yPercent: 100, ...step }, 0)
        .fromTo('[data-scroll-cue-runner]', { yPercent: -100 }, runnerPass, 0)
        .to(drums, { yPercent: 200, ...step }, secondStepStart)
        .fromTo('[data-scroll-cue-runner]', { yPercent: -100 }, runnerPass, secondStepStart);
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
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

        <div className={styles.details}>
          <p data-hero-meta>
            <span className={styles.label}>{t('contact.hero.locationLabel').toLocaleUpperCase(i18n.language)}</span>
            <span className={styles.value}>{CONTACT.city}</span>
          </p>

          <p data-hero-meta>
            <span className={styles.label}>{t('contact.hero.clockLabel').toLocaleUpperCase(i18n.language)}</span>
            <LocalClock locale={i18n.language} />
          </p>
        </div>
      </div>

      <div className={styles.scrollCue} data-hero-meta aria-hidden="true">
        <span className={styles.scrollCueInner}>
          <span key={i18n.language} className={styles.scrollCueWord}>
            {Array.from(t('contact.hero.scrollCue').toLocaleUpperCase(i18n.language)).map((letter, index) => (
              <span key={index} className={styles.scrollCueCell}>
                <span className={styles.scrollCueDrum} data-scroll-cue-drum>
                  {letter}
                  <span className={styles.scrollCueGlyphWhite}>{letter}</span>
                  <span className={styles.scrollCueGlyphAmber}>{letter}</span>
                </span>
              </span>
            ))}
          </span>
          <span className={styles.scrollCueTrack}>
            <span className={styles.scrollCueRunner} data-scroll-cue-runner />
          </span>
        </span>
      </div>
    </PageHero>
  );
}
