import { describe, expect, it } from 'vitest';
import {
  typeScript,
  typewriterCycleLength,
  TYPEWRITER_PAUSE_TICKS,
  type TerminalLine,
} from './typewriter';

const script: TerminalLine[] = [
  { command: true, text: 'whoami', tone: 'text' },
  { command: false, text: 'carlos', tone: 'muted' },
  { command: true, text: 'ls', tone: 'text' },
];

describe('typewriterCycleLength', () => {
  it('counts typed characters, output lines and the pause', () => {
    expect(typewriterCycleLength(script)).toBe(6 + 1 + 2 + TYPEWRITER_PAUSE_TICKS);
  });
});

describe('typeScript', () => {
  it('starts on an empty prompt with the caret', () => {
    expect(typeScript(script, 0)).toEqual([
      { command: true, text: '', tone: 'text', position: 0, hasCaret: true },
    ]);
  });

  it('types a command character by character', () => {
    const lines = typeScript(script, 3);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ text: 'who', hasCaret: true });
  });

  it('shows an output line at once, then a fresh prompt', () => {
    const lines = typeScript(script, 7);
    expect(lines.map((line) => line.text)).toEqual(['whoami', 'carlos', '']);
    expect(lines.at(-1)?.hasCaret).toBe(true);
    expect(lines[1]?.hasCaret).toBe(false);
  });

  it('keeps the caret on the last command once everything is typed', () => {
    const lines = typeScript(script, typewriterCycleLength(script));
    expect(lines.map((line) => line.text)).toEqual(['whoami', 'carlos', 'ls']);
    expect(lines.at(-1)?.hasCaret).toBe(true);
  });
});
