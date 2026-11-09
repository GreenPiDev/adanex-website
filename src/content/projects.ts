/** Firmanın mevcut sitesinden alınan teknik veriler. Dile bağlı değildir, metinler `projects.items.<key>` çevirisindedir. */
type SpecLabel = 'series' | 'zone' | 'certification' | 'ingress' | 'efficacy' | 'protection' | 'body' | 'temperature';

type ProjectLink = { href: string; labelKey: 'detail' | 'panels' };

type Project = {
  key: 'lighting' | 'controlBoxes' | 'emergencyExit' | 'cableGlands' | 'floodlights' | 'panels';
  image: string;
  specs: ReadonlyArray<{ label: SpecLabel; value: string }>;
  link?: ProjectLink;
};

const PRODUCTS_URL = 'https://www.adanex.com.tr/urun-kategori/exproof-urunler/';
const PANELS_URL = 'https://www.adanex.com.tr/urunler/exproof-urunler/exproof-terminal-kutulari-panolar';

// Dosyaların zemin sırası. Üçüncü dosya sarıdır, header siyah kalsın diye açık yüzey sayılır.
export const PROJECT_SURFACES = ['dark', 'light', 'light'] as const;
export const PROJECT_AMBER_TONE = 2;

export const PROJECTS: readonly Project[] = [
  {
    key: 'lighting',
    image: '/1.webp',
    specs: [
      { label: 'series', value: 'SEDEX' },
      { label: 'zone', value: 'Zone 2 / 22' },
    ],
  },
  {
    key: 'controlBoxes',
    image: '/2.webp',
    specs: [
      { label: 'certification', value: 'ATEX / IECEx' },
      { label: 'zone', value: 'Zone 1, 2, 21, 22' },
      { label: 'ingress', value: 'IP66' },
    ],
  },
  {
    key: 'emergencyExit',
    image: '/3.webp',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 1, 2, 21, 22' },
    ],
    link: { href: PRODUCTS_URL, labelKey: 'detail' },
  },
  {
    key: 'cableGlands',
    image: '/4.webp',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 1 – Zone 22' },
    ],
  },
  {
    key: 'floodlights',
    image: '/5.webp',
    specs: [
      { label: 'certification', value: 'ATEX' },
      { label: 'zone', value: 'Zone 2 / 22' },
      { label: 'ingress', value: 'IP66' },
      { label: 'efficacy', value: '150 lm/W' },
    ],
  },
  {
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

export type { Project };
