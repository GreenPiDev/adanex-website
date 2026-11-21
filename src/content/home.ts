/**
 * Ana sayfanın yapısı ve dile bağlı olmayan teknik verisi. Metinler `home` çeviri paketindedir.
 * Kaynak: firmanın mevcut sitesindeki ana sayfa. Değerler yayından önce firmaya doğrulatılmalıdır.
 */

export type HomeChapterKey = 'glands' | 'combination' | 'lighting';

/** Künyedeki bir değer. `label` çeviri anahtarıdır, `value` dile bağlı değilse burada, bağlıysa çeviridedir. */
type ChapterFact = { key: string; value?: string };

/**
 * Çözüm bölümleri sırasıyla. `slug` hem bölümün sayfa içi adresi hem de Hakkımızda'daki ürün gamında aynı ailenin
 * satırıdır: bölümün sonundaki bağlantı oraya gider.
 */
export const HOME_CHAPTERS: readonly {
  key: HomeChapterKey;
  slug: string;
  surface: 'dark' | 'light';
  facts: readonly ChapterFact[];
}[] = [
  {
    key: 'glands',
    slug: 'cable-glands',
    surface: 'dark',
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
    facts: [
      { key: 'zones', value: 'Zone 1 · 21' },
      { key: 'switchgear', value: 'ABB · Schneider' },
    ],
  },
  {
    key: 'lighting',
    slug: 'lighting',
    surface: 'dark',
    facts: [
      { key: 'certification', value: 'ATEX · IECEx' },
      { key: 'technology', value: 'LED' },
    ],
  },
];

export const ZONE_TERM = 'Zone';

/** Zone matrisinin sütunları: patlayıcı ortamın ne sıklıkla oluştuğu. Bilgi merkezindeki matrisle aynı sıradadır. */
export const GUIDE_FREQUENCIES = ['occasional', 'brief'] as const;

/**
 * Ana sayfadan teknik bilgi merkezine açılan Zone matrisi: satırlar gaz ve toz, hücreler sütun sırasıyla.
 * `slug`, `content/knowledge.ts` içindeki maddenin sayfa içi adresidir. Bilgi merkezi verisi ana pakete girmesin diye
 * burada tekrar yazılır.
 */
export const GUIDE_ZONES: readonly { medium: 'gas' | 'dust'; zones: readonly { zone: number; slug: string }[] }[] = [
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
