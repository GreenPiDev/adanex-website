import { type CSSProperties, type RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger, useGSAP } from '../../../animations/gsap';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import styles from './SectionRail.module.css';

// Bir bölüm, üst kenarı ekranın bu yüksekliğine gelince etkin sayılır.
const ACTIVE_LINE_PERCENT = 55;

// Rayın ekranda kapladığı dikey aralığın alt ve üst sınırları.
const AMBER_ENTER_PERCENT = 78;
const AMBER_LEAVE_PERCENT = 22;

function formatNumber(value: number) {
  return String(value).padStart(2, '0');
}

type SectionRailProps = {
  /** Doğrudan çocukları rayın durakları olan kapsayıcı. */
  sequenceRef: RefObject<HTMLDivElement | null>;
  items: readonly { key: string; label: string }[];
  label: string;
  /** Sarı zeminli bölümlerde ray düz siyah çizilir. */
  isAmber?: (index: number) => boolean;
};

/** Hangi bölümde olunduğunu ve ne kadar kaldığını gösterir, istenen bölüme atlatır. */
export function SectionRail({ sequenceRef, items, label, isAmber }: SectionRailProps) {
  const { i18n } = useTranslation();
  const lenisRef = useSmoothScroll();
  const rootRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isOnAmber, setIsOnAmber] = useState(false);

  // Hareket içermez, hareket azaltma tercihinde de konum bilgisi çalışır.
  useGSAP(
    () => {
      const sequence = sequenceRef.current;
      const root = rootRef.current;
      if (!sequence || !root) return;

      const triggers = Array.from(sequence.children).map((panel, index) =>
        ScrollTrigger.create({
          trigger: panel,
          start: `top ${ACTIVE_LINE_PERCENT}%`,
          end: 'max',
          onEnter: () => setActiveIndex(index),
          onLeaveBack: () => setActiveIndex(Math.max(index - 1, 0)),
        }),
      );
      triggersRef.current = triggers;

      const visibility = ScrollTrigger.create({
        trigger: sequence,
        start: `top ${ACTIVE_LINE_PERCENT}%`,
        end: `bottom ${ACTIVE_LINE_PERCENT}%`,
        onToggle: (self) => setIsVisible(self.isActive),
      });

      // Sarı bölüm rayın altına girdiği andan bir sonraki bölüm rayı geçene kadar ray düz siyah kalır.
      const panels = Array.from(sequence.children);
      const amberTriggers = panels.flatMap((panel, index) => {
        if (!isAmber?.(index)) return [];

        const next = panels[index + 1];
        return ScrollTrigger.create({
          trigger: panel,
          start: `top ${AMBER_ENTER_PERCENT}%`,
          endTrigger: next ?? sequence,
          end: next ? `top ${AMBER_LEAVE_PERCENT}%` : `bottom ${ACTIVE_LINE_PERCENT}%`,
          onToggle: (self) => setIsOnAmber(self.isActive),
        });
      });

      ScrollTrigger.create({
        trigger: sequence,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => root.style.setProperty('--progress', String(self.progress)),
      });

      // Yapışık bölümlerin konumu ancak sayfa başından doğru ölçülür, dil değişimi sayfanın ortasında olabilir.
      ScrollTrigger.refresh();
      const scroll = window.scrollY;
      setActiveIndex(Math.max(triggers.findLastIndex((trigger) => scroll >= trigger.start), 0));
      setIsVisible(visibility.isActive);
      setIsOnAmber(amberTriggers.some((trigger) => trigger.isActive));

      return () => {
        triggersRef.current = [];
      };
    },
    { dependencies: [i18n.language], revertOnUpdate: true },
  );

  const jumpTo = (index: number) => {
    const trigger = triggersRef.current[index];
    const panel = trigger?.trigger;
    if (!(panel instanceof HTMLElement)) return;

    // Mobilde adres çubuğu yüzünden innerHeight ile ScrollTrigger yüksekliği sapabilir.
    // Yapışık (sticky) bölümde kendi konumu değil, akıştaki yeri esas alınır.
    const isSticky = getComputedStyle(panel).position === 'sticky';
    const target = isSticky
      ? trigger.start + (window.innerHeight * ACTIVE_LINE_PERCENT) / 100
      : panel.getBoundingClientRect().top + window.scrollY;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { force: true });
    else window.scrollTo(0, target);
  };

  return (
    <nav
      ref={rootRef}
      className={`${styles.root} ${isVisible ? styles.visible : ''} ${isOnAmber ? styles.onAmber : ''}`}
      style={{ '--rail-count': items.length } as CSSProperties}
      aria-label={label}
    >
      <p className={styles.counter} aria-hidden="true">
        {formatNumber(activeIndex + 1)}
        <span className={styles.counterTotal}>/{formatNumber(items.length)}</span>
      </p>

      <div className={styles.rail}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={item.key}>
                <button
                  className={`${styles.item} ${isActive ? styles.active : ''}`}
                  type="button"
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => jumpTo(index)}
                >
                  <span className={styles.label} aria-hidden="true">
                    {item.label}
                  </span>
                  <span className={styles.number} aria-hidden="true">
                    {formatNumber(index + 1)}
                  </span>
                  <span className={styles.tick} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>

        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} />
        </span>
      </div>
    </nav>
  );
}
