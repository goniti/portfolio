import type { TerminalLine } from './typewriter';

/** Shape of the hero terminal script; the text of each line lives in `ui/hero/messages.ts`. */
export const TERMINAL_SCRIPT_STYLE: ReadonlyArray<Omit<TerminalLine, 'text'>> = [
  { command: true, tone: 'text' },
  { command: false, tone: 'muted' },
  { command: true, tone: 'text' },
  { command: false, tone: 'cyan' },
  { command: true, tone: 'text' },
  { command: false, tone: 'green' },
  { command: true, tone: 'text' },
  { command: false, tone: 'violet' },
];

/** Pairs each line's text with its style (extra texts are ignored). */
export function buildTerminalScript(texts: readonly string[]): TerminalLine[] {
  return TERMINAL_SCRIPT_STYLE.slice(0, texts.length).map((style, index) => ({
    ...style,
    text: texts[index] ?? '',
  }));
}
