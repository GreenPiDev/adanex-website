import type { ServiceStation } from '../../content/services';

/**
 * Noktaların dönüştüğü şekiller. Her şekil gizli bir canvas'a siyah çizilir, dolu piksellerden nokta seçilir.
 * Çizim alanı `DOT_SHAPE_SIZE` genişliğinde, `ratio` oranında yüksekliktedir. Şekiller stok ikon değil,
 * sayfanın teknik çizim diline göre burada çizilir.
 */
export const DOT_SHAPE_SIZE = 360;

export type DotShapeKey = 'ex' | ServiceStation['key'] | 'site';

type DotShape = {
  /** Yükseklik / genişlik. Yer tutucu da bu oranla kurulur. */
  ratio: number;
  draw: (context: CanvasRenderingContext2D, width: number, height: number, fontFamily: string) => void;
};

/** Tehlikeli ortam uyarısı: yuvarlak köşeli üçgen ve ortasında EX. */
function drawEx(context: CanvasRenderingContext2D, width: number, height: number, fontFamily: string) {
  const stroke = width * 0.075;
  const inset = stroke / 2 + 2;
  context.lineWidth = stroke;
  context.beginPath();
  context.moveTo(width / 2, inset);
  context.lineTo(width - inset, height - inset);
  context.lineTo(inset, height - inset);
  context.closePath();
  context.stroke();

  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  context.font = `800 ${Math.round(width * 0.3)}px ${fontFamily}`;
  context.fillText('EX', width / 2, height * 0.8);
}

/** Keşif: bir kaynağın çevresinde dışa doğru seyrelen kesikli halkalar, katman katman genişleyen bölge. */
function drawSurvey(context: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const stroke = width * 0.035;
  context.lineWidth = stroke;

  context.beginPath();
  context.arc(centerX, centerY, width * 0.055, 0, Math.PI * 2);
  context.fill();

  // İçteki halka düz, dışa gittikçe kesikler uzar ve aralar açılır.
  const rings = [
    { radius: 0.18, dash: [] },
    { radius: 0.31, dash: [width * 0.06, width * 0.035] },
    { radius: 0.45, dash: [width * 0.03, width * 0.05] },
  ];
  for (const ring of rings) {
    context.setLineDash(ring.dash);
    context.beginPath();
    context.arc(centerX, centerY, width * ring.radius, 0, Math.PI * 2);
    context.stroke();
  }
  context.setLineDash([]);
}

/** Danışmanlık: exproof armatür. Üstte boru girişi ve dolu gövde, altında koruma kafesli cam. */
function drawLuminaire(context: CanvasRenderingContext2D, width: number, height: number) {
  const stroke = width * 0.035;
  context.lineWidth = stroke;

  // Boru girişi ve gövde.
  context.fillRect(width * 0.44, 0, width * 0.12, height * 0.08);
  context.beginPath();
  context.roundRect(width * 0.22, height * 0.07, width * 0.56, height * 0.2, width * 0.03);
  context.fill();

  // Cam: altı yuvarlatılmış kapsül.
  const glassLeft = width * 0.29;
  const glassTop = height * 0.3;
  const glassWidth = width * 0.42;
  const glassHeight = height * 0.64;
  context.beginPath();
  context.roundRect(glassLeft, glassTop, glassWidth, glassHeight, [0, 0, glassWidth / 2, glassWidth / 2]);
  context.stroke();

  // Koruma kafesi: dikey teller ve ortada bir bilezik.
  context.lineWidth = stroke * 0.7;
  for (const x of [0.4, 0.5, 0.6]) {
    context.beginPath();
    context.moveTo(width * x, glassTop);
    context.lineTo(width * x, glassTop + glassHeight * (x === 0.5 ? 1 : 0.9));
    context.stroke();
  }
  context.beginPath();
  context.moveTo(glassLeft, glassTop + glassHeight * 0.45);
  context.lineTo(glassLeft + glassWidth, glassTop + glassHeight * 0.45);
  context.stroke();
}

/** Teklif: köşesi kıvrık şartname sayfası. Başlık satırı, metin satırları ve altta küçük bir tablo. */
function drawSpecification(context: CanvasRenderingContext2D, width: number, height: number) {
  const stroke = width * 0.035;
  const inset = stroke / 2 + 2;
  const left = width * 0.12 + inset;
  const right = width * 0.88 - inset;
  const top = inset;
  const bottom = height - inset;
  const fold = width * 0.18;
  context.lineWidth = stroke;
  context.lineJoin = 'round';

  context.beginPath();
  context.moveTo(left, top);
  context.lineTo(right - fold, top);
  context.lineTo(right, top + fold);
  context.lineTo(right, bottom);
  context.lineTo(left, bottom);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.moveTo(right - fold, top);
  context.lineTo(right - fold, top + fold);
  context.lineTo(right, top + fold);
  context.stroke();

  const padding = width * 0.1;
  const lineLeft = left + padding;
  const lineRight = right - padding;

  // Başlık satırı kalın, metin satırları ince ve farklı boylarda.
  context.fillRect(lineLeft, height * 0.14, (lineRight - lineLeft) * 0.55, height * 0.035);
  context.lineWidth = stroke * 0.6;
  [1, 0.85, 0.95, 0.6].forEach((length, index) => {
    const y = height * (0.27 + index * 0.075);
    context.beginPath();
    context.moveTo(lineLeft, y);
    context.lineTo(lineLeft + (lineRight - lineLeft) * length, y);
    context.stroke();
  });

  // Tablo: üç satır, iki sütun.
  const tableTop = height * 0.6;
  const tableBottom = height * 0.86;
  context.strokeRect(lineLeft, tableTop, lineRight - lineLeft, tableBottom - tableTop);
  context.beginPath();
  for (const row of [1 / 3, 2 / 3]) {
    const y = tableTop + (tableBottom - tableTop) * row;
    context.moveTo(lineLeft, y);
    context.lineTo(lineRight, y);
  }
  const split = lineLeft + (lineRight - lineLeft) * 0.4;
  context.moveTo(split, tableTop);
  context.lineTo(split, tableBottom);
  context.stroke();
}

/** Uygulama: altıgen somun, ortasında delik ve kesikli diş çizgisi. */
function drawNut(context: CanvasRenderingContext2D, width: number, height: number) {
  const stroke = width * 0.07;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - stroke / 2 - 2;
  context.lineWidth = stroke;
  context.lineJoin = 'round';

  context.beginPath();
  for (let corner = 0; corner < 6; corner += 1) {
    const angle = (Math.PI / 3) * corner;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (corner === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.stroke();

  context.lineWidth = width * 0.045;
  context.beginPath();
  context.arc(centerX, centerY, width * 0.2, 0, Math.PI * 2);
  context.stroke();

  context.lineWidth = width * 0.025;
  context.setLineDash([width * 0.025, width * 0.025]);
  context.beginPath();
  context.arc(centerX, centerY, width * 0.27, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);
}

/** Kapanış: testere dişli çatısı ve bacasıyla bir tesis, üstünde konum iğnesi. "Tesisinizi sahada" cümlesinin karşılığı. */
function drawSite(context: CanvasRenderingContext2D, width: number, height: number) {
  const stroke = width * 0.035;
  context.lineWidth = stroke;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  const ground = height * 0.94;
  const eave = height * 0.62;
  const ridge = height * 0.48;
  const left = width * 0.1;
  const right = width * 0.9;
  const sawEnd = width * 0.7;

  // Zemin çizgisi bina kenarlarından taşar.
  context.beginPath();
  context.moveTo(width * 0.03, ground);
  context.lineTo(width * 0.97, ground);
  context.stroke();

  // Bina: solda üç dişli çatı, sağda düz çatı.
  context.beginPath();
  context.moveTo(left, ground);
  context.lineTo(left, eave);
  const tooth = (sawEnd - left) / 3;
  for (let index = 0; index < 3; index += 1) {
    const toothLeft = left + tooth * index;
    context.lineTo(toothLeft, ridge);
    context.lineTo(toothLeft + tooth, eave);
  }
  context.lineTo(right, eave);
  context.lineTo(right, ground);
  context.stroke();

  // Baca, düz çatının üstünde.
  context.strokeRect(width * 0.76, height * 0.34, width * 0.07, eave - height * 0.34);

  // Pencere sırası.
  for (let index = 0; index < 3; index += 1) {
    context.fillRect(left + tooth * index + tooth * 0.3, height * 0.72, tooth * 0.4, height * 0.06);
  }

  // Konum iğnesi: damla biçimli, ucu çatıya değer.
  const pinX = left + tooth * 1.5;
  const pinY = height * 0.17;
  const pinRadius = width * 0.1;
  const tipY = ridge - height * 0.04;
  const spread = Math.acos(pinRadius / (tipY - pinY));
  context.beginPath();
  context.arc(pinX, pinY, pinRadius, Math.PI / 2 + spread, Math.PI / 2 - spread + Math.PI * 2);
  context.lineTo(pinX, tipY);
  context.closePath();
  context.stroke();
  context.beginPath();
  context.arc(pinX, pinY, pinRadius * 0.35, 0, Math.PI * 2);
  context.fill();
}

export const DOT_SHAPES: Record<DotShapeKey, DotShape> = {
  ex: { ratio: 0.9, draw: drawEx },
  survey: { ratio: 1, draw: drawSurvey },
  consulting: { ratio: 1.15, draw: drawLuminaire },
  quotation: { ratio: 1.2, draw: drawSpecification },
  // Sivri köşeleri yanda duran düzgün altıgenin oranı (sin 60°).
  implementation: { ratio: Math.sqrt(3) / 2, draw: drawNut },
  site: { ratio: 0.85, draw: drawSite },
};

export function isDotShapeKey(value: string | undefined): value is DotShapeKey {
  return value !== undefined && Object.hasOwn(DOT_SHAPES, value);
}
