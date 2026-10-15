/** Colour of a terminal line, mapped to a terminal token in the view. */
export type TerminalTone = 'text' | 'muted' | 'cyan' | 'green' | 'violet';

export interface TerminalLine {
  /** A command typed after the prompt; output lines appear at once. */
  command: boolean;
  text: string;
  tone: TerminalTone;
}

export interface TypedLine extends TerminalLine {
  /** Index in the rendered list, stable for a given tick. */
  position: number;
  /** The blinking caret sits at the end of this line. */
  hasCaret: boolean;
}

/** Ticks spent on the finished script before it starts over. */
export const TYPEWRITER_PAUSE_TICKS = 40;

const EMPTY_PROMPT: TerminalLine = { command: true, text: '', tone: 'text' };

/** Number of ticks of one full loop: one per typed character, one per output line, then a pause. */
export function typewriterCycleLength(script: readonly TerminalLine[]): number {
  const typingTicks = script.reduce(
    (total, line) => total + (line.command ? line.text.length : 1),
    0,
  );
  return typingTicks + TYPEWRITER_PAUSE_TICKS;
}

/**
 * The terminal content after `tick` ticks: commands are typed one character per tick, output
 * lines appear in one tick, and the caret ends on the line being typed or on a fresh prompt.
 */
export function typeScript(script: readonly TerminalLine[], tick: number): TypedLine[] {
  const shown: TerminalLine[] = [];
  let budget = tick;

  for (const line of script) {
    if (budget <= 0) break;
    if (line.command) {
      shown.push({ ...line, text: line.text.slice(0, Math.min(budget, line.text.length)) });
      budget -= line.text.length;
    } else {
      shown.push(line);
      budget -= 1;
    }
  }

  const last = shown.at(-1);
  if (!last?.command) shown.push(EMPTY_PROMPT);

  return shown.map((line, position) => ({
    ...line,
    position,
    hasCaret: position === shown.length - 1,
  }));
}
