import { useTranslation } from 'react-i18next';
import type { ProductFamilyKey } from '../../content/products';
import type trProducts from '../../locales/tr/products.json';

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

type ProductsBundle = Omit<typeof trProducts, 'ledger'> & {
  ledger: Omit<typeof trProducts.ledger, 'families'> & { families: Record<ProductFamilyKey, FamilyCopy> };
};

// Kalem ve sahadaki ad sayıları aileye göre değiştiği için listeler tek tek anahtar yerine dilin paketinden okunur.
export function useProductsCopy(): ProductsBundle {
  const { i18n } = useTranslation('products');
  return i18n.getResourceBundle(i18n.language, 'products');
}
