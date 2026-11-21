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

export type ChapterKey = 'basics' | 'zones' | 'marking' | 'products' | 'lighting' | 'selection' | 'faq';
export type ListKind = 'numbered' | 'flow' | 'plain';

type EntryDefinition = {
  key: string;
  /** Sayfa içi bağlantı adresi. Her iki dilde de İngilizcedir. */
  slug: string;
  listKind?: ListKind;
  image?: KnowledgeImageNumber;
  /** Yan sütunlu ekranda görsel metnin yanında değil, sol sütunda madde dizininin altında durur. */
  imageInAside?: boolean;
  /** "Bkz." satırında gösterilecek madde veya bölüm anahtarları. */
  seeAlso?: readonly string[];
  /** Tablo satırlarının açtığı maddeler, satır sırasıyla aynıdır. */
  rowTargets?: readonly string[];
  /** Kod tablosu: kod buradan, açıklaması çeviri metnindeki `codes` alanından gelir. */
  codes?: readonly CodeRow[];
};

/** Sıcaklık verilmişse açıklama yerine dile göre biçimlenmiş sıcaklık yazar. */
export type CodeRow = { code: string; celsius?: number };

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
      { key: 'whatIs', slug: 'what-is-exproof', image: 1, seeAlso: ['zones', 'productChecklist'] },
      { key: 'meaning', slug: 'exproof-meaning', image: 2, seeAlso: ['markingRead', 'productChecklist'] },
      { key: 'atex', slug: 'atex-and-exproof', seeAlso: ['faqAtex'] },
      { key: 'importance', slug: 'why-exproof-matters' },
      { key: 'usage', slug: 'where-exproof-is-used', listKind: 'flow', seeAlso: ['zones'] },
    ],
  },
  {
    key: 'zones',
    slug: 'zones',
    entries: [
      { key: 'zone0', slug: 'zone-0' },
      { key: 'zone1', slug: 'zone-1' },
      { key: 'zone2', slug: 'zone-2' },
      { key: 'zone20', slug: 'zone-20' },
      { key: 'zone21', slug: 'zone-21' },
      { key: 'zone22', slug: 'zone-22' },
    ],
  },
  {
    key: 'marking',
    slug: 'ex-marking',
    entries: [
      { key: 'markingRead', slug: 'reading-ex-marking', seeAlso: ['zones'] },
      {
        key: 'protectionTypes',
        slug: 'protection-types',
        codes: [{ code: 'Ex d' }, { code: 'Ex e' }, { code: 'Ex i' }, { code: 'Ex m' }, { code: 'Ex p' }, { code: 'Ex t' }],
      },
      {
        key: 'groups',
        slug: 'gas-and-dust-groups',
        codes: [{ code: 'IIA' }, { code: 'IIB' }, { code: 'IIC' }, { code: 'IIIA' }, { code: 'IIIB' }, { code: 'IIIC' }],
      },
      {
        key: 'temperatureClasses',
        slug: 'temperature-classes',
        codes: [
          { code: 'T1', celsius: 450 },
          { code: 'T2', celsius: 300 },
          { code: 'T3', celsius: 200 },
          { code: 'T4', celsius: 135 },
          { code: 'T5', celsius: 100 },
          { code: 'T6', celsius: 85 },
        ],
      },
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
      { key: 'lightingTypes', slug: 'lighting-types', image: 3, imageInAside: true },
      // Tablo genel bakıştır. Ayrıca iki görselli maddeyi ayırır, ilk görsel ekranda daha uzun kalır.
      {
        key: 'whereToUse',
        slug: 'which-luminaire-where',
        rowTargets: ['floodlight', 'linear', 'weatherproof', 'globe', 'tank', 'highBay'],
      },
      { key: 'floodlight', slug: 'floodlight', image: 4, imageInAside: true, seeAlso: ['whereToUse'] },
      { key: 'linear', slug: 'linear-luminaire', seeAlso: ['zones'] },
      { key: 'weatherproof', slug: 'weatherproof-luminaire', seeAlso: ['markingRead'] },
      { key: 'globe', slug: 'globe-luminaire' },
      { key: 'tank', slug: 'tank-lighting' },
      { key: 'highBay', slug: 'high-bay-luminaire', seeAlso: ['lightingSelection'] },
    ],
  },
  {
    key: 'selection',
    slug: 'selection',
    entries: [
      { key: 'productChecklist', slug: 'product-checklist', seeAlso: ['markingRead', 'faqAtex'] },
      { key: 'lightingSelection', slug: 'lighting-selection', seeAlso: ['markingRead', 'whereToUse'] },
      { key: 'rightLight', slug: 'right-light' },
    ],
  },
  {
    key: 'faq',
    slug: 'faq',
    entries: [
      { key: 'faqZone1', slug: 'faq-zone-1-products', seeAlso: ['zones'] },
      { key: 'faqHigherZone', slug: 'faq-zone-1-product-in-zone-2', seeAlso: ['zones', 'groups'] },
      { key: 'faqAtex', slug: 'faq-atex-certificate', seeAlso: ['productChecklist'] },
      { key: 'faqIecex', slug: 'faq-atex-vs-iecex', seeAlso: ['atex'] },
      { key: 'faqDocuments', slug: 'faq-documents', seeAlso: ['markingRead'] },
      { key: 'faqMaintenance', slug: 'faq-maintenance', seeAlso: ['importance'] },
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

/** "Bkz." satırı bir maddeye veya bütün bir bölüme bağlanabilir. */
export function resolveReference(key: string): { slug: string; chapterKey?: ChapterKey } {
  const chapter = KNOWLEDGE_CHAPTERS.find((item) => item.key === key);
  if (chapter) return { slug: chapter.slug, chapterKey: chapter.key };
  return { slug: getKnowledgeEntry(key).slug };
}

/**
 * Zone matrisinde satır ve sütun karşılığı ve o Zone'da kullanılabilecek en düşük ekipman kategorisi ile EPL.
 * Kaynak: 2014/34/AB ve 1999/92/AT, IEC 60079-0. Üst kategorideki ekipman daha düşük riskli alanda da kullanılabilir.
 */
export const ZONE_CELLS = [
  { key: 'zone0', medium: 'gas', frequency: 'continuous', category: '1G', epl: 'Ga' },
  { key: 'zone1', medium: 'gas', frequency: 'occasional', category: '2G', epl: 'Gb' },
  { key: 'zone2', medium: 'gas', frequency: 'brief', category: '3G', epl: 'Gc' },
  { key: 'zone20', medium: 'dust', frequency: 'continuous', category: '1D', epl: 'Da' },
  { key: 'zone21', medium: 'dust', frequency: 'occasional', category: '2D', epl: 'Db' },
  { key: 'zone22', medium: 'dust', frequency: 'brief', category: '3D', epl: 'Dc' },
] as const;

export type MarkingPartKey =
  | 'symbol'
  | 'group'
  | 'category'
  | 'atmosphere'
  | 'ex'
  | 'protection'
  | 'gasGroup'
  | 'temperature'
  | 'epl';

/**
 * Ex etiketi çözümleyicideki örnek gaz işaretlemesi: II 2G Ex db IIC T6 Gb.
 * Eğitim amaçlı bir örnektir, belirli bir ürüne ait değildir. `attached`, parçanın öncekine boşluksuz yazıldığını gösterir.
 */
export const MARKING_EXAMPLE: readonly { key: MarkingPartKey; code: string; attached?: boolean }[] = [
  { key: 'symbol', code: 'εx' },
  { key: 'group', code: 'II' },
  { key: 'category', code: '2' },
  { key: 'atmosphere', code: 'G', attached: true },
  { key: 'ex', code: 'Ex' },
  { key: 'protection', code: 'db' },
  { key: 'gasGroup', code: 'IIC' },
  { key: 'temperature', code: 'T6' },
  { key: 'epl', code: 'Gb' },
];
