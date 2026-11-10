import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECT_AMBER_TONE, PROJECT_SURFACES, PROJECTS } from '../../content/projects';
import { SectionRail } from '../ui/SectionRail/SectionRail';

type ProjectsNavProps = {
  sequenceRef: RefObject<HTMLDivElement | null>;
};

/** Çalışma dosyaları arasında gezinme rayı. */
export function ProjectsNav({ sequenceRef }: ProjectsNavProps) {
  const { t } = useTranslation();

  return (
    <SectionRail
      sequenceRef={sequenceRef}
      items={PROJECTS.map(({ key }) => ({ key, label: t(`projects.items.${key}.short`) }))}
      label={t('projects.nav.label')}
      isAmber={(index) => index % PROJECT_SURFACES.length === PROJECT_AMBER_TONE}
    />
  );
}
