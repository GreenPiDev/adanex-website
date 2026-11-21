import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { SHOWCASE_AMBER_TONE, SHOWCASE_ITEMS, SHOWCASE_SURFACES } from '../../content/showcase';
import { SectionRail } from '../ui/SectionRail/SectionRail';

type ShowcaseNavProps = {
  sequenceRef: RefObject<HTMLDivElement | null>;
};

/** Vitrindeki ürün dosyaları arasında gezinme rayı. */
export function ShowcaseNav({ sequenceRef }: ShowcaseNavProps) {
  const { t } = useTranslation('products');

  return (
    <SectionRail
      sequenceRef={sequenceRef}
      items={SHOWCASE_ITEMS.map(({ key }) => ({ key, label: t(`showcase.items.${key}.short`) }))}
      label={t('showcase.nav.label')}
      isAmber={(index) => index % SHOWCASE_SURFACES.length === SHOWCASE_AMBER_TONE}
    />
  );
}
