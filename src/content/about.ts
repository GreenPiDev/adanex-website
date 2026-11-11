/**
 * Hakkımızda sayfasının yapısı ve dile bağlı olmayan teknik verisi. Metinler `about` çeviri paketindedir.
 * Kaynak: firmanın mevcut sitesindeki hakkında sayfası. Değerler yayından önce firmaya doğrulatılmalıdır.
 */

/** Sayısal değerler aktif dile göre biçimlenir, model kodları ve markalar olduğu gibi yazılır. */
export type FactValue =
  | { kind: 'list'; items: readonly (string | number)[]; prefix?: string; unit?: string }
  | { kind: 'range'; from: number; to: number; isOpenEnded: boolean; unit: string };

type Fact = { key: string; value: FactValue };

export type ProductFamilyKey = 'lighting' | 'combination' | 'glands' | 'control' | 'ventilation';

/**
 * Ürün aileleri sevk listesinin satırlarıdır. Ad, açıklama ve kalemler `ledger.families.<key>` altındadır.
 * `facts` metinden çıkarılan teknik değerlerdir, açıklamaları `ledger.families.<key>.facts.<key>` altındadır.
 */
export const PRODUCT_FAMILIES: readonly { key: ProductFamilyKey; slug: string; facts: readonly Fact[] }[] = [
  {
    key: 'lighting',
    slug: 'lighting',
    facts: [{ key: 'zones', value: { kind: 'list', prefix: 'Zone', items: [1, 2, 21, 22] } }],
  },
  {
    key: 'combination',
    slug: 'combination-boxes',
    facts: [
      { key: 'sockets', value: { kind: 'list', items: [2, 4, 6, 8, 10] } },
      { key: 'switchgear', value: { kind: 'list', items: ['ABB', 'Schneider'] } },
    ],
  },
  {
    key: 'glands',
    slug: 'cable-glands',
    facts: [
      { key: 'unarmoured', value: { kind: 'list', items: ['A2', 'E1W'] } },
      { key: 'armoured', value: { kind: 'list', items: ['CW', 'CWY'] } },
    ],
  },
  {
    key: 'control',
    slug: 'control-safety',
    facts: [],
  },
  {
    key: 'ventilation',
    slug: 'ventilation',
    facts: [
      { key: 'series', value: { kind: 'list', items: ['ALBATROX'] } },
      { key: 'speed', value: { kind: 'list', items: [750, 1500, 3000], unit: 'rpm' } },
      { key: 'airflow', value: { kind: 'range', from: 500, to: 20000, isOpenEnded: true, unit: 'm³/h' } },
      { key: 'pressure', value: { kind: 'range', from: 100, to: 1000, isOpenEnded: true, unit: 'Pa' } },
    ],
  },
];

/** Kaynak metindeki saha türleri, `sectors.items.<key>` altındadır. */
export const ABOUT_SECTOR_KEYS = ['refinery', 'chemical', 'paint', 'food', 'storage'] as const;

export function formatIndex(value: number): string {
  return String(value).padStart(2, '0');
}

/** 1500 gibi dört basamaklı değerler gruplanmaz, 20.000 gibi büyük değerler dile göre gruplanır. */
export function formatFactValue(value: FactValue, locale: string): string {
  const number = new Intl.NumberFormat(locale, { useGrouping: 'min2' });
  const format = (item: string | number) => (typeof item === 'number' ? number.format(item) : item);

  if (value.kind === 'range') {
    const end = `${number.format(value.to)}${value.isOpenEnded ? '+' : ''}`;
    return `${number.format(value.from)}–${end} ${value.unit}`;
  }

  const items = value.items.map(format).join(' · ');
  return [value.prefix, items, value.unit].filter(Boolean).join(' ');
}
