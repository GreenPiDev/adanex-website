import { useRef } from 'react';
import { useGSAP } from '../../animations/gsap';
import { recedeWhenCovered } from '../../animations/stack';
import { SHOWCASE_ITEMS } from '../../content/showcase';
import { useIsNavCollapsed, usePrefersReducedMotion } from '../../hooks/useDevice';
import { useStickTop } from '../../hooks/useStickTop';
import styles from './Showcase.module.css';
import { ShowcaseNav } from './ShowcaseNav';
import { ShowcasePanel } from './ShowcasePanel';

/**
 * Vitrin: hero'nun üstüne biner, dosyalar kendi aralarında aynı hizada akar. Vitrin bir bütün olarak yapışır,
 * son dosya ekranı doldurunca ürün gamı onun üstüne biner.
 */
export function Showcase() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNavCollapsed = useIsNavCollapsed();
  const rootRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);

  useStickTop(rootRef);

  // Ürün gamı ekrana girerken son dosyanın içeriği geri çekilir. Telefonda ve dikey tablette yalnızca solar.
  useGSAP(
    () => {
      const root = rootRef.current;
      const panels = root?.querySelectorAll<HTMLElement>('[data-showcase-inner]');
      const last = panels?.[panels.length - 1];
      const cover = root?.nextElementSibling;
      if (prefersReducedMotion || !last || !cover) return;
      recedeWhenCovered(last, cover, { fadeOnly: isNavCollapsed });
    },
    { scope: rootRef, dependencies: [isNavCollapsed, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className={styles.showcase}>
      {/* Rayın durakları bu kapsayıcının doğrudan çocuklarıdır. */}
      <div ref={sequenceRef}>
        {SHOWCASE_ITEMS.map((item, index) => (
          <ShowcasePanel key={item.key} item={item} index={index} />
        ))}
      </div>

      <ShowcaseNav sequenceRef={sequenceRef} />
    </section>
  );
}
