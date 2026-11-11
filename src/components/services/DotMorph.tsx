import { useEffect, useRef } from 'react';
import { gsap, MOTION, useGSAP } from '../../animations/gsap';
import { getPageIntroDelay } from '../../animations/pageIntro';
import { useIsTabletPortrait, usePrefersReducedMotion } from '../../hooks/useDevice';
import { DOT_SHAPE_SIZE, DOT_SHAPES, isDotShapeKey, type DotShapeKey } from './dotShapes';
import styles from './DotMorph.module.css';

const MAX_PIXEL_RATIO = 2;
// Dalganın salınım hızı. Küçük değer, sakin ve yavaş bir deniz verir.
const WAVE_SPEED = 0.35;
// Tepelerin sağa doğru yükselişi, dalga sağda daha yüksektir.
const RISE_TO_RIGHT = 0.55;
// Dalga alanının sol ve üst kenarındaki yumuşak kaybolma payı.
const EDGE_FADE = 0.25;

// Her dönüşüm, şeklin bölümünün üst kenarı ekranın altından bu orana gelene kadar sürer.
const MORPH_END = 0.3;
// Noktalar soldan sağa sırayla kalkar. En sağdaki nokta bu kadar gecikir.
const MORPH_STAGGER = 0.4;
// Uçuş sırasındaki yayın yüksekliği, ekran yüksekliğine oranla.
const MORPH_ARC = 0.12;
// Şekle inen noktaların yerinde kıpırdama genliği (CSS pikseli) ve hızı.
const SHAPE_JITTER = 1.5;
const SHAPE_JITTER_SPEED = 1.6;
// Şekildeki noktaların boyu (CSS pikseli).
const SHAPE_DOT = 1.6;

const SHAPE_SAMPLE_STEP = 2;

// Açık zeminde şekil metnin arkasında durduğu için soluk griyle, koyu zeminde başlığın altında altınla,
// sarı zeminde siyahla çizilir.
type Tone = 'steel' | 'amber' | 'ink';
const TONE_ALPHA: Record<Tone, number> = { steel: 0.5, amber: 0.7, ink: 0.6 };

function readTone(value: string | undefined): Tone {
  return value === 'steel' || value === 'ink' ? value : 'amber';
}

type Grid = { columns: number; rows: number };

const GRID_DESKTOP: Grid = { columns: 96, rows: 30 };
const GRID_LIGHT: Grid = { columns: 64, rows: 22 };

type Point = { x: number; y: number };
type Rgb = [number, number, number];

/** Noktaların durduğu bir şekil: yer tutucusu, dönüşümü süren bölümü ve örneklenmiş noktaları. */
type Target = {
  shape: DotShapeKey;
  anchor: HTMLElement;
  section: HTMLElement;
  tone: Tone;
  points: Point[];
};

/** Bir duraktaki noktanın ekran konumu, saydamlığı ve boyu (cihaz pikseli). */
type Placement = { x: number; y: number; alpha: number; size: number };

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

/** Tekrarlanabilir karıştırma: şekiller her açılışta aynı noktalardan oluşur. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function parseHexColor(value: string, fallback: Rgb): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!match?.[1]) return fallback;
  const number = Number.parseInt(match[1], 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

/**
 * Şekil gizli canvas'a çizilir, dolu piksellerden istenen sayıda nokta seçilir.
 * Koordinatlar 0–1 aralığındadır, x soldan sağa sıralıdır: ardışık şekiller arasında eşleşme soldan sağa akar.
 */
function sampleShape(shape: DotShapeKey, count: number, fontFamily: string): Point[] {
  const { ratio, draw } = DOT_SHAPES[shape];
  const width = DOT_SHAPE_SIZE;
  const height = Math.round(DOT_SHAPE_SIZE * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];

  context.fillStyle = '#000';
  context.strokeStyle = '#000';
  context.lineJoin = 'round';
  draw(context, width, height, fontFamily);

  const pixels = context.getImageData(0, 0, width, height).data;
  const filled: Point[] = [];
  for (let y = 0; y < height; y += SHAPE_SAMPLE_STEP) {
    for (let x = 0; x < width; x += SHAPE_SAMPLE_STEP) {
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

/** Yer tutucuları DOM sırasıyla toplar. Bölümü olmayan ya da tanınmayan şekil atlanır. */
function collectTargets(): Target[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-dot-shape]')).flatMap((anchor) => {
    const shape = anchor.dataset.dotShape;
    const section = anchor.closest<HTMLElement>('section');
    if (!isDotShapeKey(shape) || !section) return [];
    return [{ shape, anchor, section, tone: readTone(anchor.dataset.dotTone), points: [] }];
  });
}

/**
 * Hero'daki altın noktalar denizi, Yaklaşım'daki gri EX tabelası, her aşamanın başlığının altındaki şekil ve
 * kapanıştaki siyah tesis silüeti aynı noktalardır.
 * Aşağı kaydırdıkça noktalar soldan başlayarak sırayla kalkar, yayla süzülüp sıradaki şeklin yerine iner.
 * Geri kaydırınca aynı yoldan bir önceki şekle döner.
 *
 * Canvas ekrana sabittir. Konumlar her karede yer tutuculardan okunur:
 * `[data-wave-anchor]` dalganın alanı, `[data-dot-shape]` sıradaki şekillerin alanı (`dotShapes.ts`).
 * Dönüşümü, yer tutucunun içinde durduğu bölüm sürer, `data-dot-tone` şeklin rengidir.
 * Ekranda görünmeyen (boyutu sıfır) yer tutucu zincirde yok sayılır.
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
    const targets = collectTargets();
    if (!canvas || !context || !waveAnchor || targets.length === 0) return;

    const grid = isLight ? GRID_LIGHT : GRID_DESKTOP;
    const count = grid.columns * grid.rows;
    const style = getComputedStyle(canvas);
    const colors: Record<Tone, Rgb> = {
      amber: parseHexColor(style.getPropertyValue('--color-amber'), [242, 176, 30]),
      steel: parseHexColor(style.getPropertyValue('--color-steel'), [138, 138, 134]),
      ink: parseHexColor(style.getPropertyValue('--color-black'), [11, 12, 13]),
    };
    const shapeFont = style.getPropertyValue('--font-sans').trim() || 'sans-serif';

    // Dalga noktaları sütun sırasıyla dizilir, şekil noktaları da soldan sağa sıralıdır: eşleşme soldan sağa akar.
    const order = Array.from({ length: count }, (_, index) => {
      const column = index % grid.columns;
      const row = Math.floor(index / grid.columns);
      return { u: column / (grid.columns - 1), v: row / (grid.rows - 1) };
    }).sort((a, b) => a.u - b.u || a.v - b.v);

    const random = seededRandom(7);
    const lift = order.map(() => 0.5 + random());
    // Her nokta kendi fazı ve temposuyla kıpırdar, şekil bir bütün olarak sallanmaz.
    const jitter = order.map(() => ({
      phaseX: random() * Math.PI * 2,
      phaseY: random() * Math.PI * 2,
      speed: 0.6 + random() * 0.8,
    }));

    let isReady = false;
    let ratio = 1;
    let time = 0;
    let lastFrame = 0;
    let frameId = 0;
    let isCancelled = false;
    const visible = new Set<Element>();

    // Şekiller, EX yazısının fontu indikten sonra örneklenir. O zamana kadar yalnızca dalga çizilir.
    document.fonts.load(`800 100px ${shapeFont}`, 'EX').then(
      () => {
        if (isCancelled) return;
        for (const target of targets) target.points = sampleShape(target.shape, count, shapeFont);
        isReady = targets.every((target) => target.points.length > 0);
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

      const viewport = window.innerHeight;

      // Sıradaki şekil, bölümü ekrana girince oluşmaya başlar. Bölümler sırayla geldiği için
      // ilerlemesi sıfırdan büyük olan son şekil, noktaların şu an gittiği şekildir.
      let to = -1;
      let progress = 0;
      if (isReady) {
        // Sayfanın sonundaki kısa bir bölüm ekranın üst kısmına hiç çıkamayabilir. Bitiş, bölümün
        // en son kaydırma konumundaki yeriyle sınırlanır, şekil sayfa sonunda yarım kalmaz.
        const remainingScroll = Math.max(document.documentElement.scrollHeight - viewport - window.scrollY, 0);
        targets.forEach((target, index) => {
          if (target.anchor.offsetWidth === 0) return;
          const top = target.section.getBoundingClientRect().top;
          const endTop = Math.min(Math.max(viewport * MORPH_END, top - remainingScroll), viewport * 0.9);
          const value = clamp01((viewport - top) / (viewport - endTop));
          if (value > 0) {
            to = index;
            progress = value;
          }
        });
      }
      if (prefersReducedMotion) progress = progress > 0.5 ? 1 : 0;
      // Hareket azaltmada geçişin ilk yarısında noktalar bir önceki duraktadır.
      if (to >= 0 && progress === 0) to -= 1;
      if (to >= 0 && progress === 0) progress = 1;
      const from = to - 1;

      const fromTarget = from >= 0 ? targets[from] : undefined;
      const toTarget = to >= 0 ? targets[to] : undefined;
      const isFromWave = !fromTarget;

      // Dalga yalnızca ilk geçişte gerekir.
      const wave = isFromWave ? waveAnchor.getBoundingClientRect() : undefined;
      const waveLeft = (wave?.left ?? 0) * ratio;
      const waveTop = (wave?.top ?? 0) * ratio;
      const waveWidth = (wave?.width ?? 0) * ratio;
      const waveHeightPx = (wave?.height ?? 0) * ratio;
      const amplitude = Math.min(waveHeightPx, waveWidth * 0.32) * 0.28;

      // Şekil kendi oranını korur, alanın ortasına yerleşir.
      const fit = (target: Target) => {
        const rect = target.anchor.getBoundingClientRect();
        const shapeRatio = DOT_SHAPES[target.shape].ratio;
        const scale = Math.min(rect.width / DOT_SHAPE_SIZE, rect.height / (DOT_SHAPE_SIZE * shapeRatio)) * ratio;
        const shapeWidth = DOT_SHAPE_SIZE * scale;
        const shapeHeight = DOT_SHAPE_SIZE * shapeRatio * scale;
        return {
          left: rect.left * ratio + (rect.width * ratio - shapeWidth) / 2,
          top: rect.top * ratio + (rect.height * ratio - shapeHeight) / 2,
          width: shapeWidth,
          height: shapeHeight,
        };
      };
      const fromBox = fromTarget ? fit(fromTarget) : undefined;
      const toBox = toTarget ? fit(toTarget) : undefined;
      const fromColor = fromTarget ? colors[fromTarget.tone] : colors.amber;
      const toColor = toTarget ? colors[toTarget.tone] : colors.amber;
      const dotSize = SHAPE_DOT * ratio;

      const place = (target: Target, box: NonNullable<typeof toBox>, index: number): Placement => {
        const point = target.points[index] as Point;
        return {
          x: box.left + point.x * box.width,
          y: box.top + point.y * box.height,
          alpha: TONE_ALPHA[target.tone],
          size: dotSize,
        };
      };

      const placeOnWave = (index: number): Placement => {
        const { u, v } = order[index] as { u: number; v: number };
        const depth = 0.4 + 0.6 * v;
        const value = waveHeight(u, v, time);
        const crest = clamp01((value + 0.6) / 1.8);
        const x = waveLeft + waveWidth * (0.5 + (u - 0.5) * (0.85 + 0.5 * v));
        const y = waveTop + waveHeightPx * (0.35 + 0.6 * v) - value * amplitude * depth;
        const fade =
          smoothstep(0, EDGE_FADE, (x - waveLeft) / waveWidth) *
          smoothstep(0, EDGE_FADE, (y - waveTop) / waveHeightPx) *
          smoothstep(0, 0.3, u);
        return {
          x,
          y,
          alpha: (0.12 + 0.88 * depth) * (0.25 + 0.75 * crest) * fade,
          size: (0.7 + 1.5 * depth * (0.6 + 0.4 * crest)) * ratio,
        };
      };

      let currentColor = '';

      for (let index = 0; index < count; index += 1) {
        const start =
          fromTarget && fromBox ? place(fromTarget, fromBox, index) : placeOnWave(index);

        // Sıra soldan sağa olduğu için gecikme, noktanın sıradaki yerinden okunur.
        const delay = (index / (count - 1)) * MORPH_STAGGER;
        const local = toTarget ? smoothstep(0, 1, clamp01((progress - delay) / (1 - MORPH_STAGGER))) : 0;

        let { x, y, alpha, size } = start;

        if (toTarget && toBox && local > 0) {
          const end = place(toTarget, toBox, index);
          const arc = Math.sin(local * Math.PI) * viewport * MORPH_ARC * ratio * (lift[index] ?? 1);
          x = lerp(start.x, end.x, local);
          y = lerp(start.y, end.y, local) - arc;
          alpha = lerp(start.alpha, end.alpha, local);
          size = lerp(start.size, end.size, local);
        }

        // Kıpırdama nokta şekle indikçe artar. Hareket azaltma tercihinde zaman durduğu için noktalar sabit kalır.
        const settled = isFromWave ? local : 1;
        if (settled > 0) {
          const wobble = jitter[index] as { phaseX: number; phaseY: number; speed: number };
          const shake = SHAPE_JITTER * ratio * settled;
          const pulse = time * SHAPE_JITTER_SPEED * wobble.speed;
          x += Math.sin(pulse + wobble.phaseX) * shake;
          y += Math.cos(pulse * 0.9 + wobble.phaseY) * shake;
        }

        if (alpha < 0.02 || x < -size || x > width + size || y < -size || y > height + size) continue;

        // Renk adımlara bölünür, sıra soldan sağa olduğu için renk az sayıda değişir.
        const step = Math.round(local * 12) / 12;
        const color = `rgb(${Math.round(lerp(fromColor[0], toColor[0], step))} ${Math.round(lerp(fromColor[1], toColor[1], step))} ${Math.round(lerp(fromColor[2], toColor[2], step))})`;
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
    for (const target of targets) intersectionObserver.observe(target.section);

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
