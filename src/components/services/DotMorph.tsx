import { useEffect, useRef } from 'react';
import { gsap, MOTION, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { useIsTabletPortrait, usePrefersReducedMotion } from '../../hooks/useDevice';
import styles from './DotMorph.module.css';

const MAX_PIXEL_RATIO = 2;
// Dalganın salınım hızı. Küçük değer, sakin ve yavaş bir deniz verir.
const WAVE_SPEED = 0.35;
// Tepelerin sağa doğru yükselişi, dalga sağda daha yüksektir.
const RISE_TO_RIGHT = 0.55;
// Dalga alanının sol ve üst kenarındaki yumuşak kaybolma payı.
const EDGE_FADE = 0.25;

// Dönüşüm, Yaklaşım bölümünün üst kenarı ekranın altından bu orana gelene kadar sürer.
const MORPH_END = 0.3;
// Noktalar soldan sağa sırayla kalkar. En sağdaki nokta bu kadar gecikir.
const MORPH_STAGGER = 0.4;
// Uçuş sırasındaki yayın yüksekliği, ekran yüksekliğine oranla.
const MORPH_ARC = 0.12;
// Tabelaya inen noktaların yerinde kıpırdama genliği (CSS pikseli) ve hızı.
const SIGN_JITTER = 1.5;
const SIGN_JITTER_SPEED = 1.6;

// Tabela çizimi: üçgen ve EX yazısı gizli bir canvas'a çizilip örneklenir.
const SIGN_SIZE = 360;
const SIGN_RATIO = 0.9;
const SIGN_SAMPLE_STEP = 2;
const SIGN_ALPHA = 0.5;

type Grid = { columns: number; rows: number };

const GRID_DESKTOP: Grid = { columns: 96, rows: 30 };
const GRID_LIGHT: Grid = { columns: 64, rows: 22 };

type Point = { x: number; y: number };

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Noktanın dalga yüksekliği, yaklaşık -1 ile 1.5 arasında. u yatay, v derinlik (0 arka, 1 ön). */
function waveHeight(u: number, v: number, time: number): number {
  return (
    Math.sin(u * Math.PI * 2.6 + time + v * 2.1) * 0.5 +
    Math.sin(u * Math.PI * 1.2 - time * 0.7 + v * 3.3) * 0.35 +
    Math.sin(v * 5.5 + time * 1.3) * 0.15 +
    u * RISE_TO_RIGHT
  );
}

/** Tekrarlanabilir karıştırma: tabela her açılışta aynı noktalardan oluşur. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function parseHexColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!match?.[1]) return fallback;
  const number = Number.parseInt(match[1], 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

/**
 * Tehlikeli ortam uyarısı: yuvarlak köşeli üçgen ve ortasında EX. Şekil gizli canvas'a çizilir,
 * dolu piksellerden istenen sayıda nokta seçilir. Koordinatlar 0–1 aralığındadır, x soldan sağa sıralıdır.
 */
function sampleSign(count: number, fontFamily: string): Point[] {
  const width = SIGN_SIZE;
  const height = Math.round(SIGN_SIZE * SIGN_RATIO);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];

  const stroke = width * 0.075;
  const inset = stroke / 2 + 2;
  context.lineJoin = 'round';
  context.lineWidth = stroke;
  context.strokeStyle = '#000';
  context.beginPath();
  context.moveTo(width / 2, inset);
  context.lineTo(width - inset, height - inset);
  context.lineTo(inset, height - inset);
  context.closePath();
  context.stroke();

  context.fillStyle = '#000';
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  context.font = `800 ${Math.round(width * 0.3)}px ${fontFamily}`;
  context.fillText('EX', width / 2, height * 0.8);

  const pixels = context.getImageData(0, 0, width, height).data;
  const filled: Point[] = [];
  for (let y = 0; y < height; y += SIGN_SAMPLE_STEP) {
    for (let x = 0; x < width; x += SIGN_SAMPLE_STEP) {
      if ((pixels[(y * width + x) * 4 + 3] ?? 0) > 128) filled.push({ x: x / width, y: y / height });
    }
  }
  if (filled.length === 0) return [];

  const random = seededRandom(81);
  for (let index = filled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [filled[index], filled[swap]] = [filled[swap] as Point, filled[index] as Point];
  }

  const points = Array.from({ length: count }, (_, index) => filled[index % filled.length] as Point);
  return points.sort((a, b) => a.x - b.x);
}

/**
 * Hero'daki altın noktalar denizi ve Yaklaşım bölümündeki gri EX tabelası aynı noktalardır.
 * Aşağı kaydırınca noktalar soldan başlayarak sırayla kalkar, yayla süzülüp tabelanın yerine iner ve griye döner.
 *
 * Canvas ekrana sabittir. Konumlar her karede yer tutuculardan okunur:
 * `[data-wave-anchor]` dalganın alanı, `[data-sign-anchor]` tabelanın alanı (metnin arkası), `[data-morph-section]` dönüşümü süren bölüm.
 * Sayfada hero'dan önce durur, böylece bölüm zeminlerinin üstünde ama yazıların ve kartların altında çizilir.
 */
export function DotMorph() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLight = useIsTabletPortrait();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const waveAnchor = document.querySelector<HTMLElement>('[data-wave-anchor]');
    const signAnchor = document.querySelector<HTMLElement>('[data-sign-anchor]');
    const section = document.querySelector<HTMLElement>('[data-morph-section]');
    if (!canvas || !context || !waveAnchor || !signAnchor || !section) return;

    const grid = isLight ? GRID_LIGHT : GRID_DESKTOP;
    const count = grid.columns * grid.rows;
    const style = getComputedStyle(canvas);
    const amber = parseHexColor(style.getPropertyValue('--color-amber'), [242, 176, 30]);
    const steel = parseHexColor(style.getPropertyValue('--color-steel'), [138, 138, 134]);
    const signFont = style.getPropertyValue('--font-sans').trim() || 'sans-serif';

    // Dalga noktaları sütun sırasıyla dizilir, tabela noktaları da soldan sağa sıralıdır: eşleşme soldan sağa akar.
    const order = Array.from({ length: count }, (_, index) => {
      const column = index % grid.columns;
      const row = Math.floor(index / grid.columns);
      return { u: column / (grid.columns - 1), v: row / (grid.rows - 1) };
    }).sort((a, b) => a.u - b.u || a.v - b.v);

    const random = seededRandom(7);
    const lift = order.map(() => 0.5 + random());
    // Her nokta kendi fazı ve temposuyla kıpırdar, tabela bir bütün olarak sallanmaz.
    const jitter = order.map(() => ({
      phaseX: random() * Math.PI * 2,
      phaseY: random() * Math.PI * 2,
      speed: 0.6 + random() * 0.8,
    }));

    let signPoints: Point[] = [];
    let ratio = 1;
    let time = 0;
    let lastFrame = 0;
    let frameId = 0;
    let isCancelled = false;
    const visible = new Set<Element>();

    // Tabela, yazı fontu indikten sonra örneklenir. O zamana kadar yalnızca dalga çizilir.
    document.fonts.load(`800 100px ${signFont}`, 'EX').then(
      () => {
        if (!isCancelled) signPoints = sampleSign(count, signFont);
      },
      () => undefined,
    );

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      const wave = waveAnchor.getBoundingClientRect();
      const sign = signAnchor.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Dönüşüm bölüm ekrana girince başlar, üst kenarı ekranın üst kısmına gelince biter.
      let progress = clamp01((viewport - section.getBoundingClientRect().top) / (viewport * (1 - MORPH_END)));
      if (prefersReducedMotion) progress = progress > 0.5 ? 1 : 0;
      if (signPoints.length === 0) progress = 0;

      const waveLeft = wave.left * ratio;
      const waveTop = wave.top * ratio;
      const waveWidth = wave.width * ratio;
      const waveHeightPx = wave.height * ratio;
      const amplitude = Math.min(waveHeightPx, waveWidth * 0.32) * 0.28;

      // Tabela kendi oranını korur, alanın ortasına yerleşir.
      const signScale = Math.min(sign.width / SIGN_SIZE, sign.height / (SIGN_SIZE * SIGN_RATIO)) * ratio;
      const signWidth = SIGN_SIZE * signScale;
      const signHeight = SIGN_SIZE * SIGN_RATIO * signScale;
      const signLeft = sign.left * ratio + (sign.width * ratio - signWidth) / 2;
      const signTop = sign.top * ratio + (sign.height * ratio - signHeight) / 2;
      const signDot = 1.6 * ratio;

      let currentColor = '';

      for (let index = 0; index < count; index += 1) {
        const { u, v } = order[index] as { u: number; v: number };
        const depth = 0.4 + 0.6 * v;
        const value = waveHeight(u, v, time);
        const crest = clamp01((value + 0.6) / 1.8);

        const waveX = waveLeft + waveWidth * (0.5 + (u - 0.5) * (0.85 + 0.5 * v));
        const waveY = waveTop + waveHeightPx * (0.35 + 0.6 * v) - value * amplitude * depth;
        const fade =
          smoothstep(0, EDGE_FADE, (waveX - waveLeft) / waveWidth) *
          smoothstep(0, EDGE_FADE, (waveY - waveTop) / waveHeightPx) *
          smoothstep(0, 0.3, u);
        const waveAlpha = (0.12 + 0.88 * depth) * (0.25 + 0.75 * crest) * fade;
        const waveSize = (0.7 + 1.5 * depth * (0.6 + 0.4 * crest)) * ratio;

        const delay = u * MORPH_STAGGER;
        const local = smoothstep(0, 1, clamp01((progress - delay) / (1 - MORPH_STAGGER)));

        let x = waveX;
        let y = waveY;
        let alpha = waveAlpha;
        let size = waveSize;

        if (local > 0) {
          const target = signPoints[index] as Point;
          const arc = Math.sin(local * Math.PI) * viewport * MORPH_ARC * ratio * (lift[index] ?? 1);
          // Kıpırdama nokta yerine indikçe artar. Hareket azaltma tercihinde zaman durduğu için noktalar sabit kalır.
          const wobble = jitter[index] as { phaseX: number; phaseY: number; speed: number };
          const shake = SIGN_JITTER * ratio * local;
          const pulse = time * SIGN_JITTER_SPEED * wobble.speed;
          x = lerp(waveX, signLeft + target.x * signWidth, local) + Math.sin(pulse + wobble.phaseX) * shake;
          y = lerp(waveY, signTop + target.y * signHeight, local) - arc + Math.cos(pulse * 0.9 + wobble.phaseY) * shake;
          // Tabela metnin arkasında durduğu için soluk çizilir, metin okunur kalır.
          alpha = lerp(waveAlpha, SIGN_ALPHA, local);
          size = lerp(waveSize, signDot, local);
        }

        if (alpha < 0.02 || x < -size || x > width + size || y < -size || y > height + size) continue;

        // Renk adımlara bölünür, sıra soldan sağa olduğu için renk az sayıda değişir.
        const step = Math.round(local * 12) / 12;
        const color = `rgb(${Math.round(lerp(amber[0], steel[0], step))} ${Math.round(lerp(amber[1], steel[1], step))} ${Math.round(lerp(amber[2], steel[2], step))})`;
        if (color !== currentColor) {
          context.fillStyle = color;
          currentColor = color;
        }

        context.globalAlpha = alpha;
        context.fillRect(x - size / 2, y - size / 2, size, size);
      }

      context.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
      lastFrame = now;
      if (!prefersReducedMotion) time += delta * WAVE_SPEED * Math.PI;
      draw();
      frameId = requestAnimationFrame(tick);
    };

    // Canvas sabit olduğu için hareket azaltma tercihinde de scroll boyunca yeniden çizilir, yalnızca dalga durur.
    const start = () => {
      if (frameId || visible.size === 0 || document.hidden) return;
      lastFrame = 0;
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      if (visible.size > 0) start();
      else {
        stop();
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    intersectionObserver.observe(waveAnchor);
    intersectionObserver.observe(section);

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isCancelled = true;
      stop();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isLight, prefersReducedMotion]);

  // Sayfa girişinde dalga yavaşça belirir.
  useGSAP(
    () => {
      if (prefersReducedMotion || !canvasRef.current) return;
      gsap.from(canvasRef.current, {
        autoAlpha: 0,
        duration: MOTION.slow * 2,
        ease: 'none',
        delay: getPageIntroDelay() + MOTION.slow,
      });
    },
    { dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
