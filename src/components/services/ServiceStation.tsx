import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, ScrollTrigger, useGSAP } from '../../animations/gsap';
import { revealWordsOnScroll } from '../../animations/reveal';
import {
  formatStageNumber,
  SERVICE_SCOPE_KEYS,
  SERVICE_STATIONS,
  type ServiceStation as Station,
} from '../../content/services';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useDevice';
import { DOT_SHAPES } from './dotShapes';
import styles from './ServiceStation.module.css';

// Hattın dolan ucu her zaman ekranın bu yüksekliğindedir, klemensler bu çizgiyi geçince yanar.
const CURRENT_LINE = 'center';

type ServiceStationProps = {
  station: Station;
  index: number;
};

/**
 * Tek hat şemasındaki bir aşama. Soldaki bara aşamalar boyunca kesintisiz akar, okundukça sarıyla dolar.
 * Dolan uç aşamanın klemensine gelince klemens yanar, oradan başlığa bir kol çıkar.
 */
export function ServiceStation({ station, index }: ServiceStationProps) {
  const { t, i18n } = useTranslation('services');
  const prefersReducedMotion = usePrefersReducedMotion();
  // Telefonda noktalar hiç kurulmadığı için şekil alanı da yoktur (ServicesPage ile aynı koşul).
  const showShape = !useIsMobile();
  const rootRef = useRef<HTMLElement>(null);
  const junctionRef = useRef<HTMLDivElement>(null);

  const number = formatStageNumber(index + 1);
  const total = formatStageNumber(SERVICE_STATIONS.length);
  const text = (key: 'title' | 'lead' | 'body') => t(`stations.${station.key}.${key}`);

  useGSAP(
    () => {
      const root = rootRef.current;
      const junction = junctionRef.current;
      if (prefersReducedMotion || !root || !junction) return;

      gsap.fromTo(
        '[data-bus-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: `top ${CURRENT_LINE}`, end: `bottom ${CURRENT_LINE}`, scrub: true },
        },
      );

      // Hareket CSS geçişiyle yapılır, geri kaydırınca klemens söner.
      ScrollTrigger.create({
        trigger: junction,
        start: `top ${CURRENT_LINE}`,
        end: 'max',
        toggleClass: { targets: junction, className: styles.lit },
      });

      gsap.utils.toArray<HTMLElement>('[data-station-title]').forEach(revealWordsOnScroll);

      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      gsap.from('[data-station-reveal]', {
        y: 32,
        autoAlpha: 0,
        ...motion,
        stagger: MOTION.stagger * 2,
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      });

      // Kapsam satırları teknik föy gibi tek tek çizilir.
      const scopeTrigger = { trigger: root.querySelector('[data-scope-list]'), start: 'top 85%', once: true };
      gsap.from('[data-scope-rule]', { scaleX: 0, ...motion, stagger: MOTION.stagger * 2, scrollTrigger: scopeTrigger });
      gsap.from('[data-scope-text]', {
        yPercent: 110,
        ...motion,
        stagger: MOTION.stagger * 2,
        delay: MOTION.stagger * 2,
        scrollTrigger: scopeTrigger,
      });
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id={station.slug}
      className={styles.station}
      data-surface="dark"
      data-motion={prefersReducedMotion ? undefined : ''}
      aria-labelledby={`${station.slug}-title`}
      tabIndex={-1}
    >
      <span className={styles.bus} aria-hidden="true">
        <span className={styles.busFill} data-bus-fill />
      </span>

      <div ref={junctionRef} className={styles.junction} aria-hidden="true">
        <span className={styles.node} />
        <span className={styles.branch} />
      </div>

      <header className={styles.head}>
        <p className={styles.stage}>
          {t('station.stage', { number, total }).toLocaleUpperCase(i18n.language)}
        </p>
        <h2 key={i18n.language} id={`${station.slug}-title`} className={styles.title} data-station-title>
          {text('title')}
        </h2>
        {/* Noktalar aşamaya gelince bu alanda aşamanın şekline dönüşür (DotMorph). Masaüstü düzeninde görünür. */}
        {showShape && (
          <span
            className={styles.shape}
            style={{ aspectRatio: `1 / ${DOT_SHAPES[station.key].ratio}` }}
            data-dot-shape={station.key}
            data-dot-tone="amber"
            aria-hidden="true"
          />
        )}
      </header>

      <div className={styles.body}>
        <p className={styles.lead} data-station-reveal>
          {text('lead')}
        </p>
        <p className={styles.text} data-station-reveal>
          {text('body')}
        </p>

        <div className={styles.scope}>
          <h3 className={styles.scopeLabel} data-station-reveal>
            {t('station.scope').toLocaleUpperCase(i18n.language)}
          </h3>
          <ol className={styles.scopeList} data-scope-list>
            {SERVICE_SCOPE_KEYS.map((key, scopeIndex) => (
              <li key={key} className={styles.scopeItem}>
                <span className={styles.scopeRule} data-scope-rule aria-hidden="true" />
                <span className={styles.scopeClip}>
                  <span className={styles.scopeText} data-scope-text>
                    <span className={styles.scopeCode} aria-hidden="true">
                      {number}.{scopeIndex + 1}
                    </span>
                    <span>{t(`stations.${station.key}.scope.${key}`)}</span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
