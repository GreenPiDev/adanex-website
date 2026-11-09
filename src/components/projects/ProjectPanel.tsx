import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { type Project, PROJECT_AMBER_TONE, PROJECT_SURFACES } from '../../content/projects';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ProjectPanel.module.css';

const REVEAL_START = 'top 60%';
const RECEDE_SCALE = 0.92;
const RECEDE_OPACITY = 0.25;
const IMAGE_START_SCALE = 1.18;

type ProjectPanelProps = {
  project: Project;
  index: number;
};

/** Tek bir çalışma dosyası. Masaüstünde bir sonraki dosya perde gibi bunun üstüne biner. */
export function ProjectPanel({ project, index }: ProjectPanelProps) {
  const { t, i18n } = useTranslation();
  const isNavCollapsed = useIsNavCollapsed();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isImageMissing, setIsImageMissing] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const curtainRef = useRef<HTMLSpanElement>(null);

  const number = index + 1;
  const title = t(`projects.items.${project.key}.title`);
  const tone = index % PROJECT_SURFACES.length;
  const isReversed = index % 2 === 1;

  // Dil değişince metin boyu değiştiği için bölme ve tetikleyiciler yeniden kurulur.
  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      const titleElement = titleRef.current;
      const media = mediaRef.current;
      const curtain = curtainRef.current;
      if (prefersReducedMotion || !root || !inner || !titleElement || !media || !curtain) return;

      const reveal = () => ({ trigger: root, start: REVEAL_START, once: true });
      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      gsap.fromTo(curtain, { scaleY: 1 }, { scaleY: 0, ...motion, scrollTrigger: reveal() });
      gsap.from('[data-panel-reveal]', {
        y: 32,
        autoAlpha: 0,
        ...motion,
        stagger: MOTION.stagger * 2,
        delay: MOTION.fast,
        scrollTrigger: reveal(),
      });

      SplitText.create(titleElement, {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 130,
            ...motion,
            stagger: MOTION.stagger,
            scrollTrigger: reveal(),
          }),
      });

      // Mobilde doğal scroll hafif kalsın diye scroll'a bağlı hareketler yok.
      if (isNavCollapsed) return;

      gsap.fromTo(
        media,
        { scale: IMAGE_START_SCALE },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } },
      );

      const next = root.nextElementSibling;
      if (!next) return;

      gsap.to(inner, {
        scale: RECEDE_SCALE,
        autoAlpha: RECEDE_OPACITY,
        transformOrigin: '50% 100%',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
      });
    },
    { scope: rootRef, dependencies: [i18n.language, isNavCollapsed, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <article
      ref={rootRef}
      className={`${styles.panel} ${tone === PROJECT_AMBER_TONE ? styles.amber : ''}`}
      data-surface={PROJECT_SURFACES[tone]}
    >
      <div ref={innerRef} className={styles.inner}>
        <div className={`${styles.frame} ${isReversed ? styles.frameEnd : ''}`}>
          <span ref={mediaRef} className={styles.media}>
            {/* Görsel eklenene kadar yerinde sıra numarası görünür. */}
            <span className={styles.placeholder} aria-hidden="true">
              {number}
            </span>
            {!isImageMissing && (
              <img
                className={styles.image}
                src={project.image}
                alt={title}
                loading="lazy"
                decoding="async"
                onError={() => setIsImageMissing(true)}
              />
            )}
          </span>

          {!isImageMissing && (
            <button
              className={styles.zoom}
              type="button"
              aria-label={t('projects.openImage', { title })}
              onClick={() => setIsLightboxOpen(true)}
            >
              {/* Dokunmatikte hover olmadığı için büyütülebildiği her zaman görünür. */}
              <span className={styles.zoomMark} aria-hidden="true" />
            </button>
          )}

          <span ref={curtainRef} className={styles.curtain} />
        </div>

        <div className={styles.body}>
          <h2 key={i18n.language} ref={titleRef} className={styles.title}>
            {title}
          </h2>

          <div className={styles.details}>
            <p className={styles.summary} data-panel-reveal>
              {t(`projects.items.${project.key}.summary`)}
            </p>

            <dl className={styles.specs}>
              {project.specs.map(({ label, value }) => (
                <div key={label} className={styles.spec} data-panel-reveal>
                  <dt className={styles.specLabel}>{t(`projects.specs.${label}`).toLocaleUpperCase(i18n.language)}</dt>
                  <dd className={styles.specValue}>{value}</dd>
                </div>
              ))}
            </dl>

            {project.link && (
              <a
                className={styles.link}
                href={project.link.href}
                target="_blank"
                rel="noopener"
                aria-label={t('projects.linkLabel', { text: t(`projects.links.${project.link.labelKey}`) })}
                data-panel-reveal
              >
                <RollText text={t(`projects.links.${project.link.labelKey}`)} />
                <RollArrow />
              </a>
            )}
          </div>
        </div>
      </div>

      {isLightboxOpen && <Lightbox src={project.image} alt={title} onClose={() => setIsLightboxOpen(false)} />}
    </article>
  );
}
