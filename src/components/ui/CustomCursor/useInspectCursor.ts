import { useTranslation } from 'react-i18next';

/** Tıklanabilir görsel düğmesine verilir: fareyle üstüne gelince imlecin yanında "İncele" yazar (CustomCursor). */
export function useInspectCursor() {
  const { t, i18n } = useTranslation();
  return { 'data-cursor-label': t('cursor.inspect').toLocaleUpperCase(i18n.language) };
}
