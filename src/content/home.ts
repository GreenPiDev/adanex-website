/**
 * Ana sayfanın yapısı ve dile bağlı olmayan teknik verisi. Metinler `home` çeviri paketindedir.
 * Kaynak: firmanın mevcut sitesindeki ana sayfa. Değerler yayından önce firmaya doğrulatılmalıdır.
 */

export type HomeChapterKey = 'glands' | 'combination' | 'lighting';

/** Künyedeki bir değer. `label` çeviri anahtarıdır, `value` dile bağlı değilse burada, bağlıysa çeviridedir. */
type ChapterFact = { key: string; value?: string };

/** Çözüm bölümleri sırasıyla. `link` bölümün sonundaki bağlantının gittiği sayfadır (mevcut sitedeki düğmeler). */
export const HOME_CHAPTERS: readonly {
  key: HomeChapterKey;
  slug: string;
  surface: 'dark' | 'light';
  link: '/about' | '/services' | '/projects';
  facts: readonly ChapterFact[];
}[] = [
  {
    key: 'glands',
    slug: 'cable-glands',
    surface: 'dark',
    link: '/about',
    facts: [
      { key: 'sizes', value: 'M10–M110' },
      { key: 'material' },
      { key: 'zones', value: 'Zone 1 · 21' },
      { key: 'ingress', value: 'IP68 / IP69K' },
    ],
  },
  {
    key: 'combination',
    slug: 'combination-boxes',
    surface: 'light',
    link: '/services',
    facts: [
      { key: 'zones', value: 'Zone 1 · 21' },
      { key: 'switchgear', value: 'ABB · Schneider' },
    ],
  },
  {
    key: 'lighting',
    slug: 'lighting',
    surface: 'dark',
    link: '/projects',
    facts: [
      { key: 'certification', value: 'ATEX · IECEx' },
      { key: 'technology', value: 'LED' },
    ],
  },
];
