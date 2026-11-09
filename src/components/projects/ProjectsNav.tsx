import { type RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger, useGSAP } from '../../animations/gsap';
import { PROJECT_AMBER_TONE, PROJECT_SURFACES, PROJECTS } from '../../content/projects';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import styles from './ProjectsNav.module.css';

// Bir dosya, üst kenarı ekranın bu yüksekliğine gelince etkin sayılır.
const ACTIVE_LINE_PERCENT = 55;

// Rayın ekranda kapladığı dikey aralığın alt ve üst sınırları.
const AMBER_ENTER_PERCENT = 78;
const AMBER_LEAVE_PERCENT = 22;

function formatNumber(value: number) {
  return String(value).padStart(2, '0');
}

type ProjectsNavProps = {
  sequenceRef: RefObject<HTMLDivElement | null>;
};

/** Hangi dosyada olunduğunu ve ne kadar kaldığını gösterir, istenen dosyaya atlatır. */
export function ProjectsNav({ sequenceRef }: ProjectsNavProps) {
  const { t, i18n } = useTranslation();
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

      // Sarı dosya rayın altına girdiği andan bir sonraki dosya rayı geçene kadar ray düz siyah kalır.
      const panels = Array.from(sequence.children);
      const amberTriggers = panels.flatMap((panel, index) => {
        if (index % PROJECT_SURFACES.length !== PROJECT_AMBER_TONE) return [];

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

      // Yapışık dosyaların konumu ancak sayfa başından doğru ölçülür, dil değişimi sayfanın ortasında olabilir.
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
    // Yapışık (sticky) dosyada kendi konumu değil, akıştaki yeri esas alınır.
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
      aria-label={t('projects.nav.label')}
    >
      <p className={styles.counter} aria-hidden="true">
        {formatNumber(activeIndex + 1)}
        <span className={styles.counterTotal}>/{formatNumber(PROJECTS.length)}</span>
      </p>

      <div className={styles.rail}>
        <ol className={styles.list}>
          {PROJECTS.map(({ key }, index) => {
            const label = t(`projects.items.${key}.short`);
            const isActive = index === activeIndex;

            return (
              <li key={key}>
                <button
                  className={`${styles.item} ${isActive ? styles.active : ''}`}
                  type="button"
                  aria-label={label}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => jumpTo(index)}
                >
                  <span className={styles.label} aria-hidden="true">
                    {label}
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
