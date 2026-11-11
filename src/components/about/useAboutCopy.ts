import { useTranslation } from 'react-i18next';
import type { ProductFamilyKey } from '../../content/about';
import type trAbout from '../../locales/tr/about.json';

/** Bir kalem ve varsa sahada bilinen diğer adları. */
export type LedgerItem = { name: string; aliases?: string[] };

type FamilyCopy = {
  short: string;
  name: string;
  /** Ailenin tamamına sahada söylenen adlar (ör. kombinasyon kutusuna "priz kutusu"). */
  aliases?: string[];
  text: string;
  items: LedgerItem[];
  facts: Record<string, string>;
};

type AboutBundle = Omit<typeof trAbout, 'ledger'> & {
  ledger: Omit<typeof trAbout.ledger, 'families'> & { families: Record<ProductFamilyKey, FamilyCopy> };
};

// Kalem ve sahadaki ad sayıları aileye göre değiştiği için listeler tek tek anahtar yerine dilin paketinden okunur.
export function useAboutCopy(): AboutBundle {
  const { i18n } = useTranslation('about');
  return i18n.getResourceBundle(i18n.language, 'about');
}
