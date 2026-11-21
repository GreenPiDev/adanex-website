/** Yollar dilden bağımsızdır ve her zaman İngilizcedir. Etiketler `nav.items.<key>` çevirisinden gelir. */
export const NAV_ITEMS = [
  { key: 'home', path: '/home' },
  { key: 'services', path: '/services' },
  { key: 'products', path: '/products' },
  { key: 'knowledgeCenter', path: '/knowledge-center' },
  { key: 'contact', path: '/contact' },
] as const;

export const MAIN_CONTENT_ID = 'main';
