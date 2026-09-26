/**
 * Hand lettering from a single-line (plotter) font: every letter is a handful of pen
 * strokes rather than an outline, so the hero claim can be drawn stroke by stroke, in
 * writing order, like a marker on a board. Runs at build time only; the page receives
 * plain SVG paths.
 *
 * Font: EMS Felix (SIL Open Font License 1.1), see src/assets/lettering/OFL.txt.
 * It has no umlauts, so ä/ö/ü are written as the base letter plus two short strokes.
 */
import fontSource from '../assets/lettering/EMSFelix.svg?raw';

/** Font units: 1000 per em, baseline 800 units below the top of the em box. */
const ASCENT = 800;

export interface Stroke {
  /** Path in word coordinates (font units, y down). */
  d: string;
  /** Length in font units, for a constant pen speed. */
  length: number;
}
export interface LetteredWord {
  text: string;
  width: number;
  strokes: Stroke[];
}

interface Glyph {
  advance: number;
  /** Subpaths as point lists, font coordinates (y up). */
  lines: [number, number][][];
}

const entities: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
const decode = (s: string) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&[a-z]+;/g, (e) => entities[e] ?? e);

/** Subpaths of a glyph outline as point lists (M, L and C; curves are flattened). */
function toLines(d: string): [number, number][][] {
  const lines: [number, number][][] = [];
  let pts: [number, number][] = [];
  for (const [, cmd, args] of d.matchAll(/([MLCZ])([^MLCZ]*)/gi)) {
    const n = (args.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
    const c = cmd.toUpperCase();
    if (c === 'M') {
      if (pts.length > 1) lines.push(pts);
      pts = [[n[0], n[1]]];
      for (let i = 2; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    } else if (c === 'L') {
      for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    } else if (c === 'C') {
      for (let i = 0; i + 5 < n.length; i += 6) {
        const [x0, y0] = pts[pts.length - 1];
        for (let k = 1; k <= 8; k++) {
          const t = k / 8;
          const u = 1 - t;
          pts.push([
            u * u * u * x0 + 3 * u * u * t * n[i] + 3 * u * t * t * n[i + 2] + t * t * t * n[i + 4],
            u * u * u * y0 + 3 * u * u * t * n[i + 1] + 3 * u * t * t * n[i + 3] + t * t * t * n[i + 5],
          ]);
        }
      }
    } else if (c === 'Z' && pts.length) {
      pts.push(pts[0]);
    }
  }
  if (pts.length > 1) lines.push(pts);
  return lines;
}

/** Glyph outlines stay raw until a word needs them. */
function parseFont(svg: string) {
  const defaultAdvance = Number(/<font\b[^>]*horiz-adv-x="([\d.]+)"/.exec(svg)?.[1] ?? 500);
  const raw = new Map<string, { advance: number; d: string }>();
  for (const [tag] of svg.matchAll(/<glyph\b[^>]*\/>/g)) {
    const attr = (name: string) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
    const unicode = attr('unicode');
    if (unicode !== undefined) raw.set(decode(unicode), { advance: Number(attr('horiz-adv-x') ?? defaultAdvance), d: attr('d') ?? '' });
  }
  const parsed = new Map<string, Glyph>();
  return {
    get(char: string): Glyph | undefined {
      if (!parsed.has(char)) {
        const g = raw.get(char);
        if (!g) return undefined;
        parsed.set(char, { advance: g.advance, lines: toLines(g.d) });
      }
      return parsed.get(char);
    },
  };
}

const glyphs = parseFont(fontSource);
const umlauts: Record<string, string> = { ä: 'a', ö: 'o', ü: 'u', Ä: 'A', Ö: 'O', Ü: 'U' };

const round = (n: number) => Math.round(n * 10) / 10;
const lengthOf = (pts: [number, number][]) =>
  pts.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - pts[i][0], y - pts[i][1]), 0);

/** One word as pen strokes, in writing order, starting at x = 0. */
function letterWord(text: string): LetteredWord {
  const strokes: Stroke[] = [];
  let x = 0;
  for (const char of text) {
    const base = umlauts[char] ?? char;
    const glyph = glyphs.get(base);
    if (!glyph) throw new Error(`lettering: no glyph for "${char}"`);
    const lines = [...glyph.lines];
    if (base !== char) {
      // two short strokes above the letter's real top (the font's declared x-height is too low),
      // centred on its upper half so they lean with the italic
      const pts = glyph.lines.flat();
      const topY = Math.max(...pts.map(([, gy]) => gy));
      const upper = pts.filter(([, gy]) => gy > topY * 0.6).map(([gx]) => gx);
      const cx = (Math.min(...upper) + Math.max(...upper)) / 2 + 20;
      const y = topY + 80;
      lines.push([[cx - 95, y], [cx - 62, y + 62]], [[cx + 40, y], [cx + 73, y + 62]]);
    }
    for (const line of lines) {
      const pts = line.map(([gx, gy]) => [x + gx, ASCENT - gy] as [number, number]);
      strokes.push({ d: `M${pts.map(([px, py]) => `${round(px)} ${round(py)}`).join('L')}`, length: lengthOf(pts) });
    }
    x += glyph.advance;
  }
  return { text, width: x, strokes };
}

/** A headline as lettered words (split at spaces), plus the vertical extent all words share. */
export function letter(headline: string) {
  const words = headline.split(' ').filter(Boolean).map(letterWord);
  const ys = words.flatMap((w) => w.strokes.flatMap((s) => s.d.split(/[ML]/).filter(Boolean).map((p) => Number(p.split(' ')[1]))));
  return { words, top: Math.min(...ys), bottom: Math.max(...ys), baseline: ASCENT };
}
