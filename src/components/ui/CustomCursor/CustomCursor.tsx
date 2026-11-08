import { useRef } from 'react';
import { gsap, useGSAP } from '../../../animations/gsap';
import { REDUCED_MOTION_QUERY, useHasFinePointer } from '../../../hooks/useDevice';
import styles from './CustomCursor.module.css';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], label, summary';
const HIDE_NATIVE_CURSOR_CLASS = 'has-custom-cursor';
const INTERACTIVE_RING_SCALE = 1.8;

function CursorElements() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const accentRingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const accentRing = accentRingRef.current;
    if (!dot || !ring || !accentRing) return;

    const isReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const dotDuration = isReduced ? 0.001 : 0.1;
    const ringDuration = isReduced ? 0.001 : 0.4;
    const ease = 'power3.out';

    gsap.set([dot, ring, accentRing], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, 'x', { duration: dotDuration, ease });
    const dotY = gsap.quickTo(dot, 'y', { duration: dotDuration, ease });
    const dotScale = gsap.quickTo(dot, 'scale', { duration: 0.3, ease });
    const dotOpacity = gsap.quickTo(dot, 'opacity', { duration: 0.2, ease: 'none' });
    const ringOpacity = gsap.quickTo(ring, 'opacity', { duration: 0.2, ease: 'none' });
    const accentRingOpacity = gsap.quickTo(accentRing, 'opacity', { duration: 0.2, ease: 'none' });

    // İki halka aynı konum ve ölçekte ilerler, yalnızca görünürlükleri değişir.
    const ringTrackers = [ring, accentRing].map((element) => ({
      x: gsap.quickTo(element, 'x', { duration: ringDuration, ease }),
      y: gsap.quickTo(element, 'y', { duration: ringDuration, ease }),
      scale: gsap.quickTo(element, 'scale', { duration: 0.35, ease }),
    }));

    let isVisible = false;
    let isInteractive = false;
    let isPressed = false;

    const updateAppearance = () => {
      const ringScale = (isInteractive ? INTERACTIVE_RING_SCALE : 1) * (isPressed ? 0.8 : 1);

      dotScale(isInteractive ? 0 : 1);
      dotOpacity(isVisible ? 1 : 0);
      ringOpacity(isVisible && !isInteractive ? 1 : 0);
      accentRingOpacity(isVisible && isInteractive ? 1 : 0);
      ringTrackers.forEach((tracker) => tracker.scale(ringScale));
    };

    const setVisible = (visible: boolean) => {
      isVisible = visible;
      updateAppearance();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { clientX: x, clientY: y } = event;

      // Görünmez imleç yeniden belirirken eski konumdan süzülmesin.
      if (!isVisible) {
        dotX(x, x);
        dotY(y, y);
        ringTrackers.forEach((tracker) => {
          tracker.x(x, x);
          tracker.y(y, y);
        });
        setVisible(true);
        return;
      }

      dotX(x);
      dotY(y);
      ringTrackers.forEach((tracker) => {
        tracker.x(x);
        tracker.y(y);
      });
    };

    const handlePointerOver = (event: PointerEvent) => {
      const interactive = event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR) !== null;
      if (interactive === isInteractive) return;
      isInteractive = interactive;
      updateAppearance();
    };

    const handlePointerPress = (pressed: boolean) => {
      isPressed = pressed;
      updateAppearance();
    };
    const handlePointerDown = () => handlePointerPress(true);
    const handlePointerUp = () => handlePointerPress(false);
    const handleLeave = () => setVisible(false);

    const root = document.documentElement;
    root.classList.add(HIDE_NATIVE_CURSOR_CLASS);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    root.addEventListener('mouseleave', handleLeave);

    return () => {
      root.classList.remove(HIDE_NATIVE_CURSOR_CLASS);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      root.removeEventListener('mouseleave', handleLeave);
    };
  });

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={accentRingRef} className={styles.accentRing} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}

/** Yalnızca fare kullanan cihazlarda çalışır, dokunmatikte hiç render edilmez. */
export function CustomCursor() {
  return useHasFinePointer() ? <CursorElements /> : null;
}
