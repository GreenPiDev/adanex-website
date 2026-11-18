import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { gsap, useGSAP } from '../../animations/gsap';
import { revealMarkedOnScroll, revealWordsOnScroll } from '../../animations/reveal';
import { recedeWhenCovered } from '../../animations/stack';
import { HOME_CHAPTERS } from '../../content/home';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { useStickTop } from '../../hooks/useStickTop';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import { ChapterPhoto, type ChapterPhotoSource } from './ChapterPhoto';
import styles from './SolutionChapter.module.css';
import { useHomeCopy } from './useHomeCopy';

type Chapter = (typeof HOME_CHAPTERS)[number];

function formatNumber(value: number) {
  return String(value).padStart(2, '0');
}

/** Bölümün altındaki görsel dizisinin bir öğesi. `name`, büyütme düğmesinin erişilebilir adında geçer. */
export type ChapterGalleryItem = ChapterPhotoSource & { name: string };

type SolutionChapterProps = {
  chapter: Chapter;
  index: number;
  /** Bölümün fotoğrafı. Verilirse künye ve bağlantı metinden çıkar, görselle metnin altına geçer. */
  photo?: ChapterPhotoSource;
  /** Fotoğraf yerine bölüme özgü çizim (Zone plakası). İkisi de yoksa metin tek kolonda durur. */
  visual?: ReactNode;
  /** Bölümün en altında tam genişlikte duran görsel dizisi (geniş ekranda üçlü). */
  gallery?: readonly ChapterGalleryItem[];
};

/**
 * Bir çözüm bölümü: numara ve başlık, giriş cümlesi, metin, künye ve ilgili sayfaya bağlantı.
 * Varsa yanında fotoğraf, altında görsel dizisi durur. Geniş ekranda bütün bölümler sola yaslıdır: başlık ve
 * metin solda, fotoğraf sağdadır; ikinci bölümde (kombinasyon kutuları) fotoğraf
 * sola geçer. İkili bölüm genişliğinde yatayda ortalanır.
 */
export function SolutionChapter({ chapter, index, photo, visual, gallery }: SolutionChapterProps) {
  const { i18n } = useTranslation('home');
  const copy = useHomeCopy().chapters[chapter.key];
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNavCollapsed = useIsNavCollapsed();
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { slug, surface, facts } = chapter;
  const locale = getLocaleFromPathname(pathname);
  const paragraphs = copy.body.split('\n');
  const visualRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('[data-chapter-title]').forEach(revealWordsOnScroll);
      revealMarkedOnScroll();
    },
    {
      scope: rootRef,
      dependencies: [i18n.language, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  // Bölüm yapışır, sıradaki bölüm üstüne biner.
  useStickTop(rootRef);

  // Sıradaki bölüm ekrana girerken bu bölümün içeriği geri çekilir. Telefonda ve dikey tablette yalnızca solar.
  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      const next = root?.nextElementSibling;
      if (prefersReducedMotion || !inner || !next) return;

      recedeWhenCovered(inner, next, { fadeOnly: isNavCollapsed });
    },
    {
      scope: rootRef,
      dependencies: [isNavCollapsed, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  // Değeri dile bağlı olan künye satırının (malzeme) değeri çeviriden gelir.
  const factValue = (fact: Chapter['facts'][number]) => fact.value ?? copy.facts[`${fact.key}Value`];

  // Fotoğrafın boyu metne göre belirlendiği için genişliği ölçülür; künyenin kenarı bu genişlikle fotoğrafa hizalanır.
  useEffect(() => {
    const root = rootRef.current;
    const photoElement = visualRef.current?.firstElementChild;
    if (!photo || !root || !photoElement) return;

    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty('--photo-inline', `${entry.borderBoxSize[0].inlineSize}px`);
    });
    observer.observe(photoElement);
    return () => observer.disconnect();
  }, [photo]);

  /*
   * Geniş ekranda fotoğraf kaydırırken metinle birlikte gelir: boyu başlık ve metin kadardır, künye metin kolonunda
   * altta kalır. Fotoğraf yapışır ve alt kenarı künyenin alt kenarına gelene kadar ekranda kalır.
   * --photo-block fotoğrafın boyu, --photo-stick yapıştığı yükseklik (bölümün üstünden başlığa kadar olan pay),
   * --photo-travel fotoğrafın yol alacağı mesafedir. Bölüm, üstte yapışmadan önce en az bu mesafe kadar kayar.
   */
  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    const copyElement = copyRef.current;
    const factsElement = factsRef.current;
    if (!photo || !root || !head || !copyElement || !factsElement) return;

    const update = () => {
      const copyBottom = copyElement.offsetTop + copyElement.offsetHeight;
      const factsBottom = factsElement.offsetTop + factsElement.offsetHeight;
      root.style.setProperty('--photo-block', `${copyBottom - head.offsetTop}px`);
      root.style.setProperty('--photo-travel', `${Math.max(0, factsBottom - copyBottom)}px`);
      root.style.setProperty(
        '--photo-stick',
        `${head.getBoundingClientRect().top - root.getBoundingClientRect().top}px`,
      );
    };
    update();

    const observer = new ResizeObserver(update);
    [root, head, copyElement, factsElement].forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [photo]);

  const link = (
    <Link className={styles.link} data-reveal to={localizePath(chapter.link, locale)}>
      <RollText text={copy.link.toLocaleUpperCase(i18n.language)} />
      <RollArrow />
    </Link>
  );
  const note = copy.factsNote && <p className={styles.factsNote} data-reveal>{copy.factsNote}</p>;

  // Fotoğraflı bölümde künye tek kolondur; not üstünde, bağlantı sağ altındadır.
  const factsBlock = (
    <div ref={photo ? factsRef : undefined} className={`${styles.factsBlock} ${photo ? styles.factsWide : ''}`}>
      {photo && note}
      <dl className={styles.facts} data-reveal-items>
        {facts.map((fact) => (
          <div key={fact.key} className={styles.fact}>
            <dt className={styles.factLabel}>{copy.facts[fact.key]}</dt>
            <dd className={styles.factValue}>{factValue(fact)}</dd>
          </div>
        ))}
      </dl>
      {photo ? <div className={styles.factsFooter}>{link}</div> : note}
    </div>
  );

  const photoStyle = photo ? ({ '--photo-ratio': photo.width / photo.height } as CSSProperties) : undefined;

  return (
    <section
      ref={rootRef}
      id={slug}
      className={[
        styles.chapter,
        photo && styles.withPhoto,
        photo && index % 2 === 1 && styles.photoLeft,
        !photo && !visual && styles.solo,
      ]
        .filter(Boolean)
        .join(' ')}
      data-surface={surface}
      tabIndex={-1}
      aria-labelledby={`${slug}-title`}
      style={photoStyle}
    >
      <div ref={innerRef} className={styles.inner}>
        <header ref={headRef} className={styles.head}>
          <p className={styles.number} aria-hidden="true" data-reveal>
            {formatNumber(index + 1)}
            <span className={styles.total}>/{formatNumber(HOME_CHAPTERS.length)}</span>
          </p>
          <h2 key={i18n.language} id={`${slug}-title`} className={styles.title} data-chapter-title>
            {copy.title}
          </h2>
        </header>

        <div className={styles.body}>
          <div ref={copyRef} className={styles.copy}>
            <p className={styles.lead} data-reveal>{copy.lead}</p>
            <div className={styles.paragraphs}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.text} data-reveal>
                  {paragraph}
                </p>
              ))}
            </div>

            {!photo && factsBlock}
            {!photo && link}
          </div>

          {photo ? (
            <div ref={visualRef} className={`${styles.visual} ${styles.photoVisual}`}>
              <ChapterPhoto {...photo} name={copy.name} fitHeight />
            </div>
          ) : (
            visual && <div className={styles.visual}>{visual}</div>
          )}

          {photo && factsBlock}
        </div>

        {gallery && gallery.length > 0 && (
          <ul className={styles.gallery}>
            {gallery.map((item) => (
              <li key={item.src} className={styles.galleryItem}>
                <ChapterPhoto {...item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
