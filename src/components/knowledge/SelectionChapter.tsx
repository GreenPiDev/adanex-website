import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getKnowledgeChapter, getKnowledgeEntry } from '../../content/knowledge';
import { Chapter } from './Chapter';
import { Entry } from './Entry';
import { useKnowledge } from './knowledgeHooks';
import styles from './SelectionChapter.module.css';

function formatStep(index: number) {
  return String(index + 1).padStart(2, '0');
}

type ChecklistProps = {
  steps: { title: string; text: string }[];
  checked: ReadonlySet<number>;
  onToggle: (index: number) => void;
  onReset: () => void;
};

/** Sahada elde tutulan kontrol formu gibi işaretlenir. Bir sonuç üretmez, yalnızca hatırlatır. */
function Checklist({ steps, checked, onToggle, onReset }: ChecklistProps) {
  const { t } = useTranslation('knowledge');

  return (
    <div className={styles.checklist}>
      <ol className={styles.list}>
        {steps.map((step, index) => (
          <li key={step.title}>
            <label className={styles.row}>
              <input
                className={styles.input}
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => onToggle(index)}
              />
              <span className={styles.box} aria-hidden="true" />
              <span className={styles.number} aria-hidden="true">
                {formatStep(index)}
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{step.title}</span>
                <span className={styles.question}>{step.text}</span>
              </span>
            </label>
          </li>
        ))}
      </ol>

      <div className={styles.footer}>
        <p aria-live="polite">{t('checklist.progress', { done: checked.size, total: steps.length })}</p>
        {checked.size > 0 && (
          <button className={styles.reset} type="button" onClick={onReset}>
            {t('checklist.reset')}
          </button>
        )}
      </div>
    </div>
  );
}

/** Sarı bölüm: sayfanın "karar anı", yedi kriterlik liste ve aydınlatma seçim adımları. */
export function SelectionChapter() {
  const { entries } = useKnowledge();
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());
  const chapter = getKnowledgeChapter('selection');
  const steps = entries.productChecklist.steps ?? [];

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  };

  return (
    <Chapter
      chapter={chapter}
      surface="light"
      tone="amber"
      className={styles.root}
      aside={
        <p className={styles.counter} aria-hidden="true">
          {checked.size}
          <span className={styles.counterTotal}>/{steps.length}</span>
        </p>
      }
    >
      <Entry entry={getKnowledgeEntry('productChecklist')}>
        <Checklist steps={steps} checked={checked} onToggle={toggle} onReset={() => setChecked(new Set())} />
      </Entry>
      <Entry entry={getKnowledgeEntry('lightingSelection')} />
      <Entry entry={getKnowledgeEntry('rightLight')} className={styles.closing} />
    </Chapter>
  );
}
