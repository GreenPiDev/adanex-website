import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);

// tokens.css içindeki --ease-out ile aynı eğri.
CustomEase.create('adanexOut', '0.7, 0, 0.15, 1');

export const MOTION = {
  ease: 'adanexOut',
  fast: 0.3,
  base: 0.45,
  slow: 0.8,
  stagger: 0.05,
} as const;

export { gsap, ScrollTrigger, useGSAP };
