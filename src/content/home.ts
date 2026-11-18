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

/** Teknik terim, iki dilde de aynı yazılır. */
export const ZONE_TERM = 'Zone';

/** Aydınlatmanın kullanıldığı Zone'lar. `slug`, teknik bilgi merkezindeki maddenin sayfa içi adresidir. */
export const LIGHTING_ZONES: readonly { medium: 'gas' | 'dust'; zones: readonly { zone: number; slug: string }[] }[] = [
  {
    medium: 'gas',
    zones: [
      { zone: 1, slug: 'zone-1' },
      { zone: 2, slug: 'zone-2' },
    ],
  },
  {
    medium: 'dust',
    zones: [
      { zone: 21, slug: 'zone-21' },
      { zone: 22, slug: 'zone-22' },
    ],
  },
];

export const LIGHTING_SECTOR_KEYS = ['refinery', 'chemical', 'paint', 'food', 'storage'] as const;
