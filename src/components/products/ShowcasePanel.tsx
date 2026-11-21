import { type ComponentProps, type MouseEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { useInspectCursor } from '../ui/CustomCursor/useInspectCursor';
import { gsap, MOTION, SplitText, useGSAP } from '../../animations/gsap';
import { revealTrigger } from '../../animations/reveal';
import { formatIndex, PRODUCT_FAMILIES } from '../../content/products';
import { type ShowcaseItem, SHOWCASE_AMBER_TONE, SHOWCASE_SURFACES } from '../../content/showcase';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { useSectionJump } from '../../hooks/useSectionJump';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { Lightbox } from '../ui/Lightbox/Lightbox';
import { InlineLinkArrow, RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ShowcasePanel.module.css';
import { useProductsCopy } from './useProductsCopy';

/** Özet metnindeki dış bağlantı. Yazısı çeviri metninden `Trans` ile gelir. */
function SummaryLink({ children, ...rest }: ComponentProps<'a'>) {
  return (
    <a {...rest}>
      {children}
      <InlineLinkArrow />
    </a>
  );
}

const IMAGE_START_SCALE = 1.18;

type ShowcasePanelProps = {
  item: ShowcaseItem;
  index: number;
};

/**
 * Vitrindeki tek bir ürün dosyası. Dosyalar birbirinin üstüne binmez, aynı hizada akar.
 * Ailesinin etiketi ürün gamındaki satıra götürür, teklif bağlantısı formu o ailenin mesajıyla açar.
 */
export function ShowcasePanel({ item, index }: ShowcasePanelProps) {
  const { t, i18n } = useTranslation('products');
  const { t: tCommon } = useTranslation();
  const { ledger } = useProductsCopy();
  const jump = useSectionJump();
  const locale = getLocaleFromPathname(useLocation().pathname);
  const inspectCursor = useInspectCursor();
  const isNavCollapsed = useIsNavCollapsed();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isImageMissing, setIsImageMissing] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const curtainRef = useRef<HTMLSpanElement>(null);

  const number = index + 1;
  const title = t(`showcase.items.${item.key}.title`);
  const familyIndex = PRODUCT_FAMILIES.findIndex(({ key }) => key === item.family);
  const family = PRODUCT_FAMILIES[familyIndex];
  const quotePath = localizePath('/contact', locale);
  const upper = (text: string) => text.toLocaleUpperCase(i18n.language);
  const tone = index % SHOWCASE_SURFACES.length;
  const isReversed = index % 2 === 1;

  // Dil değişince metin boyu değiştiği için bölme ve tetikleyiciler yeniden kurulur.
  useGSAP(
    () => {
      const root = rootRef.current;
      const titleElement = titleRef.current;
      const media = mediaRef.current;
      const curtain = curtainRef.current;
      if (prefersReducedMotion || !root || !titleElement || !media || !curtain) return;

      const reveal = () => revealTrigger(root);
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

      // Mobilde doğal scroll hafif kalsın diye scroll'a bağlı hareket yok.
      if (isNavCollapsed) return;

      gsap.fromTo(
        media,
        { scale: IMAGE_START_SCALE },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } },
      );
    },
    { scope: rootRef, dependencies: [i18n.language, isNavCollapsed, prefersReducedMotion], revertOnUpdate: true },
  );

  const handleFamilyClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    event.preventDefault();
    jump(slug);
  };

  return (
    <article
      ref={rootRef}
      className={`${styles.panel} ${tone === SHOWCASE_AMBER_TONE ? styles.amber : ''}`}
      data-surface={SHOWCASE_SURFACES[tone]}
      data-tone={tone === SHOWCASE_AMBER_TONE ? 'amber' : undefined}
    >
      <div className={styles.inner} data-showcase-inner>
        <div className={`${styles.frame} ${isReversed ? styles.frameEnd : ''}`}>
          <span ref={mediaRef} className={styles.media}>
            {/* Görsel eklenene kadar yerinde sıra numarası görünür. */}
            <span className={styles.placeholder} aria-hidden="true">
              {number}
            </span>
            {!isImageMissing && (
              <img
                className={styles.image}
                src={item.image}
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
              {...inspectCursor}
              type="button"
              aria-label={tCommon('a11y.openImage', { title })}
              onClick={() => setIsLightboxOpen(true)}
            />
          )}

          <span ref={curtainRef} className={styles.curtain} />
        </div>

        <div className={styles.body}>
          {family && (
            <a
              className={styles.family}
              href={`#${family.slug}`}
              aria-label={t('showcase.familyLabel', { family: ledger.families[family.key].name })}
              onClick={(event) => handleFamilyClick(event, family.slug)}
              data-panel-reveal
            >
              <span className={styles.familyCode} aria-hidden="true">
                {formatIndex(familyIndex + 1)}
              </span>
              {upper(ledger.families[family.key].name)}
            </a>
          )}

          <h2 key={i18n.language} ref={titleRef} className={styles.title}>
            {title}
          </h2>

          <div className={styles.details}>
            <p className={styles.summary} data-panel-reveal>
              <Trans
                i18nKey={`showcase.items.${item.key}.summary`}
                t={t}
                components={{
                  anchor: item.link ? (
                    <SummaryLink
                      className={styles.inlineLink}
                      href={item.link.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={t('showcase.linkLabel', { text: t(`showcase.links.${item.link.labelKey}`) })}
                    />
                  ) : (
                    <span />
                  ),
                }}
              />
            </p>

            <dl className={styles.specs}>
              {item.specs.map(({ label, value }) => (
                <div key={label} className={styles.spec} data-panel-reveal>
                  <dt className={styles.specLabel}>{upper(t(`showcase.specs.${label}`))}</dt>
                  <dd className={styles.specValue}>{value}</dd>
                </div>
              ))}
            </dl>

            {/* Ailesi olmayan ürünlerde form ön doldurmasız açılır. */}
            <Link
              className={styles.quote}
              to={family ? `${quotePath}?product=${family.slug}` : quotePath}
              aria-label={t('showcase.quoteLabel', { product: title })}
              data-panel-reveal
            >
              <RollText text={upper(ledger.quote)} />
              <RollArrow />
            </Link>
          </div>
        </div>
      </div>

      {isLightboxOpen && <Lightbox src={item.image} alt={title} onClose={() => setIsLightboxOpen(false)} />}
    </article>
  );
}
