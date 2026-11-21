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

/**
 * Teklif aşamasındaki "teklif için gerekenler" listesi. Metinler `stations.quotation.request.items` altındadır.
 * Liste yayından önce firma onayından geçmelidir.
 */
export const SERVICE_QUOTE_REQUIREMENT_KEYS = ['specification', 'diagram', 'zone'] as const;

/** İletişim formuna hangi hizmetten gelindiğini taşıyan sorgu parametresi: `/contact?service=quotation`. */
export const SERVICE_CONTACT_PARAM = 'service';

/** Formu önceden doldurulan hizmetler. Metinler `contact.form.prefill.services.<slug>` altındadır. */
export const SERVICE_PREFILL_SLUGS = ['quotation'] as const;

export type ServicePrefillSlug = (typeof SERVICE_PREFILL_SLUGS)[number];

export function isServicePrefillSlug(value: string | null): value is ServicePrefillSlug {
  return SERVICE_PREFILL_SLUGS.some((slug) => slug === value);
}

/** Firmanın mevcut sitesindeki "Türkiye'nin 81 ilinde sahada uygulama desteği" ifadesinden. */
export const SERVICE_PROVINCE_COUNT = 81;

export function formatStageNumber(value: number): string {
  return String(value).padStart(2, '0');
}
