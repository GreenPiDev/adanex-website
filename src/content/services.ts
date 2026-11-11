/**
 * Hizmetler sayfasının yapısı. Sıra, işin sahadaki akışıdır: keşif, danışmanlık, teklif, uygulama.
 * Metinler `services` çeviri paketindedir (`stations.<key>`). `cardImage`, hero kartının arka plan görselidir.
 */
export const SERVICE_STATIONS = [
  { key: 'survey', slug: 'survey', cardImage: '/s-2.webp' },
  { key: 'consulting', slug: 'consulting', cardImage: '/s-1.webp' },
  { key: 'quotation', slug: 'quotation', cardImage: '/s-3.webp' },
  { key: 'implementation', slug: 'implementation', cardImage: '/s-4.webp' },
] as const;

export type ServiceStation = (typeof SERVICE_STATIONS)[number];

/** Hero'da cümlenin yanındaki görsel. Ölçüler, yüklenirken yer kaymasın diye dosyanın gerçek boyutlarıdır. */
export const SERVICE_HERO_IMAGE = { src: '/services-1.webp', width: 1672, height: 941 } as const;

export const SERVICE_SCOPE_KEYS = ['first', 'second', 'third'] as const;

/** Firmanın mevcut sitesindeki "Türkiye'nin 81 ilinde sahada uygulama desteği" ifadesinden. */
export const SERVICE_PROVINCE_COUNT = 81;

export function formatStageNumber(value: number): string {
  return String(value).padStart(2, '0');
}
