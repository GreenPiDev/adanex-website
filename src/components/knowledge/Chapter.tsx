import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { KnowledgeChapter } from '../../content/knowledge';
import styles from './Chapter.module.css';
import { Entry } from './Entry';
import { EntryLink } from './KnowledgeText';
import { useActiveEntry, useChapterReveal, useKnowledge } from './knowledgeHooks';

type ChapterProps = {
  chapter: KnowledgeChapter;
  surface: 'dark' | 'light';
  /** Sarı zeminli bölümde header negatif yerine düz siyah çizilir. */
  tone?: 'amber';
  className?: string;
  /** Yapışık başlık sütununun altındaki ek içerik. */
  aside?: ReactNode;
  /** Verilmezse bölümün maddeleri sırayla yazılır. */
  children?: ReactNode;
  /** Maddelerin altındaki uyarı. */
  note?: string;
};

/** Sözlük düzeni: solda yapışık bölüm başlığı ve madde dizini, sağda akan maddeler. */
export function Chapter({ chapter, surface, tone, className = '', aside, children, note }: ChapterProps) {
  const { i18n } = useTranslation();
  const { chapters, entries, common } = useKnowledge();
  const rootRef = useRef<HTMLElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const activeIndex = useActiveEntry(entriesRef);

  useChapterReveal(rootRef);

  return (
    <section
      ref={rootRef}
      id={chapter.slug}
      className={`${styles.chapter} ${className}`}
      data-surface={surface}
      data-tone={tone}
      tabIndex={-1}
    >
      <header className={styles.head}>
        <p className={styles.number} aria-hidden="true">
          {chapter.number}
        </p>
        <h2 key={i18n.language} className={styles.chapterTitle} data-chapter-title>
          {chapters[chapter.key].title}
        </h2>

        <nav className={styles.toc} aria-label={common.entryIndex}>
          <ol className={styles.tocList}>
            {chapter.entries.map((entry, index) => (
              <li key={entry.key}>
                <EntryLink
                  className={`${styles.tocLink} ${index === activeIndex ? styles.tocActive : ''}`}
                  slug={entry.slug}
                >
                  <span className={styles.tocCode} aria-hidden="true">
                    {entry.code}
                  </span>
                  <span>{entries[entry.key].short ?? entries[entry.key].title}</span>
                </EntryLink>
              </li>
            ))}
          </ol>
        </nav>

        {aside}
      </header>

      <div ref={entriesRef} className={styles.entries}>
        {children ?? chapter.entries.map((entry) => <Entry key={entry.key} entry={entry} />)}
        {note && <p className={styles.chapterNote}>{note}</p>}
      </div>
    </section>
  );
}
