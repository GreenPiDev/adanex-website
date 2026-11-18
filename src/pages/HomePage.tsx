import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/home';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from '../animations/gsap';
import type { ChapterPhotoSource } from '../components/home/ChapterPhoto';
import { HomeClosing } from '../components/home/HomeClosing';
import { HomeHero } from '../components/home/HomeHero';
import { HomeIntro } from '../components/home/HomeIntro';
import { type ChapterGalleryItem, SolutionChapter } from '../components/home/SolutionChapter';
import { useHomeCopy } from '../components/home/useHomeCopy';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { HOME_CHAPTERS, type HomeChapterKey } from '../content/home';

// Rakor ve kombinasyon kutusu bölümlerinin fotoğrafları (public klasöründe, gerçek piksel ölçüsüyle).
const GLANDS_PHOTO = { src: '/anasayfa-2.webp', width: 1254, height: 1254 } as const;
const COMBINATION_PHOTO = { src: '/anasayfa-3.webp', width: 1254, height: 1254 } as const;
// Endüstriyel çözümler bölümünün altındaki üçlü görsel dizisi (hepsi 1:1).
const INDUSTRIAL_GALLERY = [
  { key: 'facility', src: '/anasayfa-4.webp' },
  { key: 'lighting', src: '/anasayfa-5.webp' },
  { key: 'enclosures', src: '/anasayfa-6.webp' },
] as const;
const GALLERY_SIZE = 1254;

/**
 * Ana sayfa: ürün videolu giriş, firmanın kısa tanımı ve içindekiler, üç çözüm (rakorlar, kombinasyon kutuları,
 * endüstriyel çözümler) ve iletişime çağrı. Kaynak: firmanın mevcut sitesindeki ana sayfa.
 */
export function HomePage() {
  const { t } = useTranslation('home');
  const { chapters, rail } = useHomeCopy();

  // Çözüm bölümlerinin yanındaki fotoğraflar ve altındaki görsel dizileri.
  const chapterPhotos: Partial<Record<HomeChapterKey, ChapterPhotoSource>> = {
    glands: { ...GLANDS_PHOTO, alt: t('photos.glands') },
    combination: { ...COMBINATION_PHOTO, alt: t('photos.combination') },
  };
  const chapterGalleries: Partial<Record<HomeChapterKey, ChapterGalleryItem[]>> = {
    lighting: INDUSTRIAL_GALLERY.map(({ key, src }) => ({
      src,
      width: GALLERY_SIZE,
      height: GALLERY_SIZE,
      name: t(`photos.industrial.${key}.name`),
      alt: t(`photos.industrial.${key}.alt`),
    })),
  };
  const sequenceRef = useRef<HTMLDivElement>(null);

  // Büyük başlıklar font inince boy değiştirir, tetikleyici konumları yeniden ölçülür.
  useEffect(() => {
    let isCancelled = false;
    document.fonts.ready.then(
      () => {
        if (!isCancelled) ScrollTrigger.refresh();
      },
      () => undefined,
    );

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <HomeHero />
      <HomeIntro />

      <div ref={sequenceRef}>
        {HOME_CHAPTERS.map((chapter, index) => (
          <SolutionChapter
            key={chapter.key}
            chapter={chapter}
            index={index}
            photo={chapterPhotos[chapter.key]}
            gallery={chapterGalleries[chapter.key]}
          />
        ))}
      </div>

      <SectionRail
        sequenceRef={sequenceRef}
        items={HOME_CHAPTERS.map(({ key }) => ({ key, label: chapters[key].short }))}
        label={rail.label}
      />

      <HomeClosing />
    </>
  );
}
