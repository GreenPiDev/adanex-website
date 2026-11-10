/** Metinler `locales/{tr,en}/knowledge.json` içindedir, burada yalnızca dile bağlı olmayan yapı durur. */

export type KnowledgeImageNumber = 1 | 2 | 3 | 4;
export type KnowledgeImageSize = 'mark' | 'wide' | 'poster' | 'document';

/** Genişlik ve yükseklik dosyanın gerçek ölçüleridir, görsel inerken sayfa kaymasın diye gereklidir. */
export const KNOWLEDGE_IMAGES: Readonly<
  Record<KnowledgeImageNumber, { src: string; width: number; height: number; size: KnowledgeImageSize }>
> = {
  1: { src: '/tbm-1.webp', width: 286, height: 344, size: 'mark' },
  2: { src: '/tbm-2.webp', width: 1752, height: 897, size: 'wide' },
  3: { src: '/tbm-3.webp', width: 1024, height: 1536, size: 'poster' },
  4: { src: '/tbm-4.webp', width: 1086, height: 1448, size: 'document' },
};

const PRODUCTS_BASE = 'https://www.adanex.com.tr/urunler/exproof-urunler';

/** Anahtarlar çeviri metinlerindeki bağlantı etiketleridir, ör. `<tank>...</tank>`. */
export const PRODUCT_LINKS = {
  panels: `${PRODUCTS_BASE}/exproof-terminal-kutulari-panolar`,
  ledluminaire: `${PRODUCTS_BASE}/exproof-led-dizgili-lineer-armatur-zone-1`,
  slimlinear: `${PRODUCTS_BASE}/exproof-zone-1-led-lineer-armatur-slim-kasa`,
  floodlight: `${PRODUCTS_BASE}/exproof-led-projektor-zone-2`,
  emergency: `${PRODUCTS_BASE}/exproof-floresan-armatur-zone-1`,
  handlamp: `${PRODUCTS_BASE}/exproof-kafesli-seyyar-el-baladozu-zone-1`,
  glands: 'https://www.adanex.com.tr/urunler/kablo-rakor/cwy-exproof-zirhli-pirinc-kablo-rakor',
  boxes: `${PRODUCTS_BASE}/exproof-buat-kutusu`,
  combo: `${PRODUCTS_BASE}/exproof-kombinasyon-fis-priz-kutusu`,
  tank: `${PRODUCTS_BASE}/exproof-evo-tank-aydinlatma-armaturu`,
  catalog: 'https://www.adanex.com.tr/urun-kategori/exproof-urunler/',
} as const;

export type ChapterKey = 'basics' | 'zones' | 'products' | 'lighting' | 'selection' | 'faq';
export type ListKind = 'numbered' | 'flow' | 'plain';

type EntryDefinition = {
  key: string;
  /** Sayfa içi bağlantı adresi. Her iki dilde de İngilizcedir. */
  slug: string;
  listKind?: ListKind;
  image?: KnowledgeImageNumber;
  /** "Bkz." satırında gösterilecek maddelerin anahtarları. */
  seeAlso?: readonly string[];
};

type ChapterDefinition = {
  key: ChapterKey;
  slug: string;
  entries: readonly EntryDefinition[];
};

const CHAPTERS: readonly ChapterDefinition[] = [
  {
    key: 'basics',
    slug: 'basics',
    entries: [
      { key: 'whatIs', slug: 'what-is-exproof', image: 1, seeAlso: ['zone1', 'productChecklist'] },
      { key: 'meaning', slug: 'exproof-meaning', image: 2, listKind: 'numbered', seeAlso: ['productChecklist'] },
      { key: 'atex', slug: 'atex-and-exproof', seeAlso: ['faqAtex'] },
      { key: 'importance', slug: 'why-exproof-matters' },
      { key: 'usage', slug: 'where-exproof-is-used', listKind: 'flow', seeAlso: ['zone1'] },
    ],
  },
  {
    key: 'zones',
    slug: 'zones',
    entries: [
      { key: 'zone1', slug: 'zone-1' },
      { key: 'zone21', slug: 'zone-21' },
      { key: 'zone2', slug: 'zone-2' },
      { key: 'zone22', slug: 'zone-22' },
    ],
  },
  {
    key: 'products',
    slug: 'products',
    entries: [
      { key: 'productLighting', slug: 'exproof-lighting', listKind: 'plain', seeAlso: ['lightingTypes'] },
      { key: 'glands', slug: 'cable-glands', listKind: 'plain' },
      { key: 'boxes', slug: 'junction-boxes' },
      { key: 'panels', slug: 'control-panels' },
      { key: 'solutions', slug: 'adanex-solutions', listKind: 'plain' },
    ],
  },
  {
    key: 'lighting',
    slug: 'lighting',
    entries: [
      { key: 'lightingTypes', slug: 'lighting-types', image: 3 },
      { key: 'floodlight', slug: 'floodlight', image: 4, seeAlso: ['whereToUse'] },
      { key: 'linear', slug: 'linear-luminaire', seeAlso: ['zone1'] },
      { key: 'weatherproof', slug: 'weatherproof-luminaire', seeAlso: ['atex'] },
      { key: 'globe', slug: 'globe-luminaire' },
      { key: 'tank', slug: 'tank-lighting' },
      { key: 'highBay', slug: 'high-bay-luminaire', seeAlso: ['lightingSelection'] },
      { key: 'whereToUse', slug: 'which-luminaire-where' },
    ],
  },
  {
    key: 'selection',
    slug: 'selection',
    entries: [
      { key: 'productChecklist', slug: 'product-checklist', seeAlso: ['faqAtex'] },
      { key: 'lightingSelection', slug: 'lighting-selection', seeAlso: ['whereToUse'] },
      { key: 'rightLight', slug: 'right-light' },
    ],
  },
  {
    key: 'faq',
    slug: 'faq',
    entries: [
      { key: 'faqWhat', slug: 'faq-what-is-exproof', seeAlso: ['whatIs'] },
      { key: 'faqZone1', slug: 'faq-zone-1-products', seeAlso: ['zone1'] },
      { key: 'faqZoneDiff', slug: 'faq-zone-1-vs-2', seeAlso: ['zone1', 'zone2'] },
      { key: 'faqDust', slug: 'faq-dust-zones', seeAlso: ['zone21', 'zone22'] },
      { key: 'faqAtex', slug: 'faq-atex-certificate', seeAlso: ['productChecklist'] },
    ],
  },
];

export type KnowledgeEntry = EntryDefinition & {
  chapterKey: ChapterKey;
  /** Sözlükteki madde numarası, ör. 4.2. */
  code: string;
};

export type KnowledgeChapter = Omit<ChapterDefinition, 'entries'> & {
  number: string;
  entries: readonly KnowledgeEntry[];
};

export const KNOWLEDGE_CHAPTERS: readonly KnowledgeChapter[] = CHAPTERS.map((chapter, chapterIndex) => ({
  ...chapter,
  number: String(chapterIndex + 1).padStart(2, '0'),
  entries: chapter.entries.map((entry, entryIndex) => ({
    ...entry,
    chapterKey: chapter.key,
    code: `${chapterIndex + 1}.${entryIndex + 1}`,
  })),
}));

export const KNOWLEDGE_ENTRIES: readonly KnowledgeEntry[] = KNOWLEDGE_CHAPTERS.flatMap(({ entries }) => entries);

export function getKnowledgeChapter(key: ChapterKey): KnowledgeChapter {
  const chapter = KNOWLEDGE_CHAPTERS.find((item) => item.key === key);
  if (!chapter) throw new Error(`Bilinmeyen bölüm: ${key}`);
  return chapter;
}

export function getKnowledgeEntry(key: string): KnowledgeEntry {
  const entry = KNOWLEDGE_ENTRIES.find((item) => item.key === key);
  if (!entry) throw new Error(`Bilinmeyen madde: ${key}`);
  return entry;
}

/** "Hangi armatür nerede" tablosundaki satırların açtığı maddeler, satır sırasıyla aynıdır. */
export const WHERE_TO_USE_TARGETS: readonly string[] = [
  'floodlight',
  'linear',
  'weatherproof',
  'globe',
  'tank',
  'highBay',
];

/** Zone matrisinde satır ve sütun karşılığı: maddeler sırayla gaz/toz, sık/kısa. */
export const ZONE_CELLS = [
  { key: 'zone1', medium: 'gas', frequency: 'occasional' },
  { key: 'zone21', medium: 'dust', frequency: 'occasional' },
  { key: 'zone2', medium: 'gas', frequency: 'brief' },
  { key: 'zone22', medium: 'dust', frequency: 'brief' },
] as const;
