import type { ProductFamilyKey } from './products';

/**
 * Ürünler sayfasının vitrini: fotoğraflı öne çıkan ürünler. Teknik veriler firmanın mevcut sitesinden alındı,
 * dile bağlı değildir. Metinler `products` paketinde `showcase.items.<key>` altındadır.
 */
type SpecLabel = 'series' | 'zone' | 'certification' | 'ingress' | 'efficacy' | 'protection' | 'body' | 'temperature';

type ShowcaseLink = { href: string; labelKey: 'panels' };

type ShowcaseItem = {
  key: 'lighting' | 'controlBoxes' | 'emergencyExit' | 'cableGlands' | 'floodlights' | 'panels';
  image: string;
  /** Ürünün ürün gamındaki ailesi. Etiketi o satıra götürür, teklif formu o ailenin mesajıyla açılır. */
  family?: ProductFamilyKey;
  specs: ReadonlyArray<{ label: SpecLabel; value: string }>;
  link?: ShowcaseLink;
};

const PANELS_URL = 'https://www.adanex.com.tr/urunler/exproof-urunler/exproof-terminal-kutulari-panolar';

// Dosyaların zemin sırası. Üçüncü dosya sarıdır, header siyah kalsın diye açık yüzey sayılır.
export const SHOWCASE_SURFACES = ['dark', 'light', 'light'] as const;
export const SHOWCASE_AMBER_TONE = 2;

export const SHOWCASE_ITEMS: readonly ShowcaseItem[] = [
  {
    key: 'lighting',
    image: '/1.webp',
    family: 'lighting',
    specs: [
      { label: 'series', value: 'SEDEX' },
      { label: 'zone', value: 'Zone 2 / 22' },
    ],
  },
  {
    key: 'controlBoxes',
    image: '/2.webp',
    family: 'control',
    specs: [
      { label: 'certification', value: 'ATEX / IECEx' },
      { label: 'zone', value: 'Zone 1, 2, 21, 22' },
      { label: 'ingress', value: 'IP66' },
    ],
  },
  {
    key: 'emergencyExit',
    image: '/3.webp',
    family: 'lighting',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 1, 2, 21, 22' },
    ],
  },
  {
    key: 'cableGlands',
    image: '/4.webp',
    family: 'glands',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 1 – Zone 22' },
    ],
  },
  {
    key: 'floodlights',
    image: '/5.webp',
    family: 'lighting',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 2 / 22' },
      { label: 'ingress', value: 'IP66' },
      { label: 'efficacy', value: '150 lm/W' },
    ],
  },
  {
    // Pano ve bağlantı kutuları ürün gamındaki ailelerin hiçbirine tam oturmaz, etiketi yoktur.
    key: 'panels',
    image: '/6.webp',
    specs: [
      { label: 'protection', value: 'Ex d IIC / Ex tb IIIC' },
      { label: 'zone', value: 'Zone 1, 2, 21, 22' },
      { label: 'body', value: 'ETIAL 140' },
      { label: 'temperature', value: '−40 °C / +80 °C' },
    ],
    link: { href: PANELS_URL, labelKey: 'panels' },
  },
];

export type { ShowcaseItem };
