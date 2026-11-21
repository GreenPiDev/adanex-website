import { useTranslation } from 'react-i18next';
import type { HomeChapterKey } from '../../content/home';
import type trHome from '../../locales/tr/home.json';

type ChapterCopy = {
  short: string;
  name: string;
  title: string;
  lead: string;
  /** Paragraflar satır sonuyla ayrılır. */
  body: string;
  /** Künye etiketleri. Değeri dile bağlı satırların değeri `<anahtar>Value` altındadır. */
  facts: Record<string, string>;
  factsNote?: string;
};

type HomeBundle = Omit<typeof trHome, 'chapters'> & { chapters: Record<HomeChapterKey, ChapterCopy> };

// Künye satırları bölüme göre değiştiği için bölüm metinleri tek tek anahtar yerine dilin paketinden okunur.
export function useHomeCopy(): HomeBundle {
  const { i18n } = useTranslation('home');
  return i18n.getResourceBundle(i18n.language, 'home');
}
