import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/home';
import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from '../animations/gsap';
import type { ChapterPhotoSource } from '../components/home/ChapterPhoto';
import { HomeClosing } from '../components/home/HomeClosing';
import { HomeHero } from '../components/home/HomeHero';
import { HomeIntro } from '../components/home/HomeIntro';
import { SolutionChapter } from '../components/home/SolutionChapter';
import { useHomeCopy } from '../components/home/useHomeCopy';
import { ZonePlate } from '../components/home/ZonePlate';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { HOME_CHAPTERS, type HomeChapterKey } from '../content/home';

// Rakor bölümünün fotoğrafı (public klasöründe, gerçek piksel ölçüsüyle).
const GLANDS_PHOTO = { src: '/anasayfa-2.webp', width: 843, height: 1123 } as const;

/**
 * Ana sayfa: ürün videolu giriş, firmanın kısa tanımı ve içindekiler, üç çözüm (rakorlar, kombinasyon kutuları,
 * aydınlatma) ve iletişime çağrı. Kaynak: firmanın mevcut sitesindeki ana sayfa.
 */
export function HomePage() {
  const { t } = useTranslation('home');
  const { chapters, rail } = useHomeCopy();

  // Çözüm bölümlerinin yanındaki fotoğraf ve çizimler. Kombinasyon kutularının görseli yoktur, metni tek kolonda okunur.
  const chapterPhotos: Partial<Record<HomeChapterKey, ChapterPhotoSource>> = {
    glands: { ...GLANDS_PHOTO, alt: t('photos.glands') },
  };
  const chapterVisuals: Partial<Record<HomeChapterKey, ReactNode>> = {
    lighting: <ZonePlate />,
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
            visual={chapterVisuals[chapter.key]}
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
