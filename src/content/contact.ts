/** Firmanın mevcut sitesinden alınan iletişim bilgileri. Dile bağlı değildir. */
export const CONTACT = {
  company: 'ADANEX ELEKTRİK',
  addressLines: ['Sanayi Mah. Koray Sok. No:16-a', 'İzmit / Kocaeli'],
  phone: { display: '+90 530 457 01 94', href: 'tel:+905304570194' },
  email: 'info@adanex.com.tr',
  website: { display: 'www.adanex.com.tr', href: 'https://www.adanex.com.tr' },
  mapQuery: 'Koray Sk. No:16 D:a, Sanayi, 41040 İzmit/Kocaeli, Türkiye',
} as const;

/** Çalışma saatleri, 24 saat biçiminde. Kapalı günlerde saat yoktur. */
export type OpeningHours = {
  days: 'weekdays' | 'saturday' | 'sunday';
  hours: { open: string; close: string } | null;
};

export const OPENING_HOURS: readonly OpeningHours[] = [
  { days: 'weekdays', hours: { open: '09:00', close: '18:00' } },
  { days: 'saturday', hours: { open: '09:00', close: '16:00' } },
  { days: 'sunday', hours: null },
];

/** Footer bağlantısı varsayılan olarak ana siteye gider, burada yazan sayfalarda bu adrese gider. */
export const FOOTER_LINK_OVERRIDES: Readonly<Record<string, string>> = {
  '/projects': 'https://www.adanex.com.tr/urun-kategori/exproof-urunler/',
};
