import '@fontsource/barlow-semi-condensed/600.css';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectPanel } from '../components/projects/ProjectPanel';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { ProjectsNav } from '../components/projects/ProjectsNav';
import { PROJECTS } from '../content/projects';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  const { t } = useTranslation();
  const sequenceRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ProjectsHero />

      {/* Yapışık dosyalar bu kapsayıcının sonunda birlikte serbest kalır. */}
      <div ref={sequenceRef}>
        {PROJECTS.map((project, index) => (
          <ProjectPanel key={project.key} project={project} index={index} />
        ))}
      </div>

      <ProjectsNav sequenceRef={sequenceRef} />

      <section className={styles.note} data-surface="dark">
        <p className={styles.noteText}>{t('projects.zoneNote')}</p>
      </section>
    </>
  );
}
