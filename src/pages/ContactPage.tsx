import '@fontsource/barlow-semi-condensed/600.css';
import { useRef } from 'react';
import { gsap, MOTION, useGSAP } from '../animations/gsap';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactMap } from '../components/contact/ContactMap';
import { usePrefersReducedMotion } from '../hooks/useDevice';

export function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 48,
          autoAlpha: 0,
          duration: MOTION.slow,
          ease: MOTION.ease,
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef}>
      {/* Hero'nun yapışık kalacağı alan yalnızca form bölümünün sonuna kadar sürer. */}
      <div>
        <ContactHero />
        <ContactForm />
      </div>
      <ContactMap />
    </div>
  );
}
