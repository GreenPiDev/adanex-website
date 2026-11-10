import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getKnowledgeChapter, getKnowledgeEntry, ZONE_CELLS } from '../../content/knowledge';
import chapterStyles from './Chapter.module.css';
import { useChapterReveal, useKnowledge } from './knowledgeHooks';
import styles from './ZoneMatrix.module.css';

const FREQUENCY_ROWS = ['occasional', 'brief'] as const;

// Ölçüm farkları cümleyi ikinci satıra düşürmesin diye küçük bir pay bırakılır.
const NOTE_FIT_MARGIN = 1.01;

/** Dört Zone, ortam (gaz/toz) ve sıklık eksenli bir matristir. */
export function ZoneMatrix() {
  const { i18n } = useTranslation();
  const { chapters, entries, zoneAxes, common } = useKnowledge();
  const rootRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const chapter = getKnowledgeChapter('zones');

  useChapterReveal(rootRef);

  // Geniş ekranda not tek satırdır, yazı boyutu cümlenin `em` cinsinden uzunluğuyla CSS'te hesaplanır.
  useLayoutEffect(() => {
    const note = noteRef.current;
    const context = document.createElement('canvas').getContext('2d');
    if (!note || !context) return;

    let isCancelled = false;
    const { fontWeight, fontFamily } = getComputedStyle(note);
    const measure = () => {
      if (isCancelled) return;
      context.font = `${fontWeight} 100px ${fontFamily}`;
      note.style.setProperty('--note-em', String((context.measureText(common.note).width / 100) * NOTE_FIT_MARGIN));
    };

    measure();
    document.fonts.load(`${fontWeight} 1em ${fontFamily}`, common.note).then(measure, () => undefined);

    return () => {
      isCancelled = true;
    };
  }, [common.note]);

  return (
    <section ref={rootRef} id={chapter.slug} className={styles.root} data-surface="dark" tabIndex={-1}>
      <header className={styles.head}>
        <div>
          <p className={chapterStyles.number} aria-hidden="true">
            {chapter.number}
          </p>
          <h2 key={i18n.language} className={chapterStyles.chapterTitle} data-chapter-title>
            {chapters.zones.title}
          </h2>
        </div>
        <p className={styles.intro}>{chapters.zones.intro}</p>
      </header>

      <div className={styles.matrix}>
        <p className={`${styles.axis} ${styles.columnGas}`} aria-hidden="true">
          {zoneAxes.gas}
        </p>
        <p className={`${styles.axis} ${styles.columnDust}`} aria-hidden="true">
          {zoneAxes.dust}
        </p>

        {FREQUENCY_ROWS.map((frequency, rowIndex) => (
          <p
            key={frequency}
            className={`${styles.axis} ${styles.rowAxis}`}
            style={{ gridRow: rowIndex + 2 }}
            aria-hidden="true"
          >
            {zoneAxes[frequency]}
          </p>
        ))}

        {ZONE_CELLS.map(({ key, medium, frequency }) => {
          const [word, number] = entries[key].title.split(' ');

          return (
            <article
              key={key}
              id={getKnowledgeEntry(key).slug}
              className={`${styles.cell} ${styles[medium]} ${styles[frequency]}`}
              tabIndex={-1}
              data-entry
            >
              <span className={styles.mark} aria-hidden="true" data-entry-mark />
              <h3 className={styles.title}>
                <span className={styles.word}>{word} </span>
                <span className={styles.digits}>{number}</span>
              </h3>
              {/* Eksenler dar ekranda görünmez, aynı bilgi her hücrenin kendisinde yazar. */}
              <p className={styles.tags}>
                {zoneAxes[medium]} / {zoneAxes[frequency]}
              </p>
              <p className={styles.definition}>{entries[key].lead}</p>
            </article>
          );
        })}
      </div>

      <p ref={noteRef} className={styles.note}>
        {common.note}
      </p>
    </section>
  );
}
