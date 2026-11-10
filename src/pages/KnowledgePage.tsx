import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/knowledge';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../animations/gsap';
import { Chapter } from '../components/knowledge/Chapter';
import { KnowledgeHero } from '../components/knowledge/KnowledgeHero';
import { useEntryJump, useKnowledge } from '../components/knowledge/knowledgeHooks';
import { SelectionChapter } from '../components/knowledge/SelectionChapter';
import { ZoneMatrix } from '../components/knowledge/ZoneMatrix';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { getKnowledgeChapter, KNOWLEDGE_CHAPTERS } from '../content/knowledge';
import styles from './KnowledgePage.module.css';

const AMBER_CHAPTER_INDEX = KNOWLEDGE_CHAPTERS.findIndex(({ key }) => key === 'selection');

/** Baştan sona okunan bir yazı değil, aranıp açılan bir başvuru kitabı. */
export function KnowledgePage() {
  const { chapters, common, rail } = useKnowledge();
  const jump = useEntryJump();
  const sequenceRef = useRef<HTMLDivElement>(null);

  // Paylaşılan madde adresiyle açılışta konum, fontlar yerine oturduktan sonra hesaplanır.
  useEffect(() => {
    let isCancelled = false;

    document.fonts.ready.then(
      () => {
        if (isCancelled) return;
        ScrollTrigger.refresh();
        const slug = window.location.hash.slice(1);
        if (slug) jump(slug, { immediate: true });
      },
      () => undefined,
    );

    return () => {
      isCancelled = true;
    };
  }, [jump]);

  return (
    <>
      <KnowledgeHero />

      <div ref={sequenceRef}>
        <Chapter chapter={getKnowledgeChapter('basics')} surface="light" />
        <ZoneMatrix />
        <Chapter chapter={getKnowledgeChapter('products')} surface="light" />
        <Chapter chapter={getKnowledgeChapter('lighting')} surface="dark" note={common.note} />
        <SelectionChapter />
        <Chapter chapter={getKnowledgeChapter('faq')} surface="light" />
      </div>

      <SectionRail
        sequenceRef={sequenceRef}
        items={KNOWLEDGE_CHAPTERS.map(({ key }) => ({ key, label: chapters[key].short }))}
        label={rail.label}
        isAmber={(index) => index === AMBER_CHAPTER_INDEX}
      />

      <section className={styles.note} data-surface="dark">
        <p className={styles.noteText}>{common.note}</p>
      </section>
    </>
  );
}
