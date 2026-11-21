import { type PointerEvent, useState } from 'react';
import { MARKING_EXAMPLE, type MarkingPartKey } from '../../content/knowledge';
import { useKnowledge } from './knowledgeHooks';
import styles from './MarkingDecoder.module.css';

const PART_ID_PREFIX = 'marking-part-';

/** ATEX'in altıgen içindeki εx işareti. Yazı, çevresindeki işaretlemeyle aynı fonttadır. */
function ExSymbol() {
  return (
    <svg className={styles.symbol} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="currentColor" strokeWidth="7" />
      <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="46">
        εx
      </text>
    </svg>
  );
}

/**
 * Örnek bir Ex işaretlemesi ve her parçasının anlamı. Açıklamaların hepsi her zaman görünür,
 * etkileşim yalnızca işaretlemedeki parça ile açıklamasını birbirine bağlar.
 */
export function MarkingDecoder() {
  const { entries, marking } = useKnowledge();
  const parts = entries.markingRead.parts ?? {};
  const [activeKey, setActiveKey] = useState<MarkingPartKey | null>(null);

  // Üzerine gelince vurgu yalnızca farede çalışır, dokunmada seçim tıklamayla yapılır.
  const highlightOnHover = (key: MarkingPartKey) => (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setActiveKey(key);
  };

  return (
    <div
      className={styles.decoder}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setActiveKey(null);
      }}
    >
      <div className={styles.labelWrap}>
        <div className={styles.label} role="group" aria-label={marking.partsLabel}>
          {MARKING_EXAMPLE.map(({ key, code, attached }, index) => (
            <button
              key={key}
              type="button"
              className={[
                styles.segment,
                attached ? styles.attached : '',
                MARKING_EXAMPLE[index + 1]?.attached ? styles.joinsNext : '',
                key === activeKey ? styles.active : '',
              ].join(' ')}
              aria-label={`${code}, ${parts[key]?.name ?? ''}`}
              aria-pressed={key === activeKey}
              aria-describedby={`${PART_ID_PREFIX}${key}`}
              onClick={() => setActiveKey(key)}
              onPointerEnter={highlightOnHover(key)}
            >
              {/* Vurgu düğmenin dokunma alanını değil, yalnızca yazının kendisini boyar. */}
              <span className={styles.glyph}>{key === 'symbol' ? <ExSymbol /> : code}</span>
            </button>
          ))}
        </div>
        <p className={styles.sample}>{marking.sample}</p>
      </div>

      <ol className={styles.parts}>
        {MARKING_EXAMPLE.map(({ key, code }) => (
          <li
            key={key}
            id={`${PART_ID_PREFIX}${key}`}
            className={`${styles.part} ${key === activeKey ? styles.partActive : ''}`}
            onPointerEnter={highlightOnHover(key)}
          >
            <span className={styles.partCode} aria-hidden="true">
              {code}
            </span>
            <span className={styles.partName}>{parts[key]?.name}</span>
            <span className={styles.partText}>{parts[key]?.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
