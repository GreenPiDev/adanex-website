import { type RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, MOTION, useGSAP } from '../../animations/gsap';
import { revealWordsOnScroll } from '../../animations/reveal';
import { formatFactValue, formatIndex, PRODUCT_FAMILIES } from '../../content/about';
import { usePrefersReducedMotion } from '../../hooks/useDevice';
import styles from './ProductLedger.module.css';
import { useAboutCopy } from './useAboutCopy';

/** Sahada bilinen adlar tırnak içinde, adın yanında soluk yazılır. Ekran okuyucu önce etiketi okur. */
function Aliases({ aliases, label, className }: { aliases?: string[]; label: string; className: string }) {
  if (!aliases?.length) return null;

  return (
    <span className={className}>
      <span className={styles.srOnly}>{label} </span>
      {aliases.map((alias) => (
        <q key={alias} className={styles.alias}>
          {alias}
        </q>
      ))}
    </span>
  );
}

type ProductLedgerProps = {
  /** Satırları saran kap, sağdaki ray bunun çocuklarını izler. */
  sequenceRef: RefObject<HTMLDivElement | null>;
};

/**
 * Ürün gamı bir sevk listesi gibi okunur: her ürün ailesi numaralı bir satırdır, içeriği ve teknik değerleri yanındadır.
 * Liste bitince üzerine "sevke hazır" damgası basılır: ürünler kullanıma hazır sevk edilir.
 */
export function ProductLedger({ sequenceRef }: ProductLedgerProps) {
  const { t, i18n } = useTranslation('about');
  const { ledger } = useAboutCopy();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const upper = (text: string) => text.toLocaleUpperCase(i18n.language);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (prefersReducedMotion || !root) return;

      gsap.utils.toArray<HTMLElement>('[data-ledger-title]').forEach(revealWordsOnScroll);

      const motion = { duration: MOTION.slow, ease: MOTION.ease };

      // Her satır kendi çizgisiyle çizilir, içeriği ardından yerine oturur.
      gsap.utils.toArray<HTMLElement>('[data-ledger-row]').forEach((row) => {
        const scrollTrigger = { trigger: row, start: 'top 85%', once: true };
        gsap.from(row.querySelector('[data-ledger-rule]'), { scaleX: 0, ...motion, scrollTrigger });
        gsap.from(row.querySelectorAll('[data-ledger-reveal]'), {
          y: 28,
          autoAlpha: 0,
          ...motion,
          stagger: MOTION.stagger * 2,
          delay: MOTION.stagger * 2,
          scrollTrigger,
        });
      });

      // Damga büyükten hızla iner, değdiği anda çevresine bir halka yayılır.
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-stamp]', start: 'top 82%', once: true } })
        .from('[data-stamp]', { scale: 2.4, rotation: -10, autoAlpha: 0, duration: MOTION.base, ease: 'power4.in' })
        .fromTo(
          '[data-stamp-ring]',
          { scale: 1, autoAlpha: 0.7 },
          { scale: 1.35, autoAlpha: 0, duration: MOTION.slow, ease: 'power2.out' },
        );
    },
    { scope: rootRef, dependencies: [i18n.language, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.ledger} data-surface="dark" aria-labelledby="product-ledger-title">
      <header className={styles.head}>
        <h2 key={i18n.language} id="product-ledger-title" className={styles.title} data-ledger-title>
          {ledger.title}
        </h2>
        <p className={styles.lead}>{ledger.lead}</p>
      </header>

      {/* Sütun başlıkları yalnızca geniş ekranda görünür, her satır kendi içinde de okunur. */}
      <div className={styles.columns} aria-hidden="true">
        <span />
        <span>{upper(ledger.columns.family)}</span>
        <span>{upper(ledger.columns.items)}</span>
        <span>{upper(ledger.columns.facts)}</span>
      </div>

      <div ref={sequenceRef} className={styles.rows}>
        {PRODUCT_FAMILIES.map(({ key, slug, facts }, index) => {
          const family = ledger.families[key];

          return (
            <article
              key={key}
              id={slug}
              className={styles.row}
              aria-labelledby={`${slug}-title`}
              tabIndex={-1}
              data-ledger-row
            >
              <span className={styles.rule} data-ledger-rule aria-hidden="true" />

              <span className={styles.code} aria-hidden="true" data-ledger-reveal>
                {formatIndex(index + 1)}
              </span>

              <div className={styles.family} data-ledger-reveal>
                <h3 id={`${slug}-title`} className={styles.name}>
                  {family.name}
                </h3>
                <Aliases aliases={family.aliases} label={ledger.aliasLabel} className={styles.familyAliases} />
                <p className={styles.text}>{family.text}</p>
              </div>

              <ul className={styles.items} data-ledger-reveal>
                {family.items.map((item) => (
                  <li key={item.name} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <Aliases aliases={item.aliases} label={ledger.aliasLabel} className={styles.itemAliases} />
                  </li>
                ))}
              </ul>

              {facts.length > 0 && (
                <dl className={styles.facts} data-ledger-reveal>
                  {facts.map((fact) => (
                    <div key={fact.key} className={styles.fact}>
                      <dt className={styles.factLabel}>{family.facts[fact.key]}</dt>
                      <dd className={styles.factValue}>{formatFactValue(fact.value, i18n.language)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          );
        })}
      </div>

      <div className={styles.stampArea}>
        <p className={styles.stamp} data-stamp>
          <span className={styles.stampRing} data-stamp-ring aria-hidden="true" />
          <span className={styles.stampTitle}>{upper(t('ledger.stamp.title'))}</span>
          <span className={styles.stampCaption}>{upper(t('ledger.stamp.caption'))}</span>
        </p>
      </div>
    </section>
  );
}
