import { describe, expect, it } from 'vitest';
import { heroMessages } from '../ui/hero/messages';
import { buildTerminalScript, TERMINAL_SCRIPT_STYLE } from './terminal';

describe('buildTerminalScript', () => {
  it('styles every line of the copy, in both locales', () => {
    for (const copy of Object.values(heroMessages)) {
      expect(copy.terminal.script).toHaveLength(TERMINAL_SCRIPT_STYLE.length);
      const script = buildTerminalScript(copy.terminal.script);
      expect(script[0]).toEqual({ command: true, tone: 'text', text: 'whoami' });
    }
  });

  it('ignores texts without a style', () => {
    expect(buildTerminalScript(Array.from({ length: 12 }, () => 'line'))).toHaveLength(
      TERMINAL_SCRIPT_STYLE.length,
    );
  });
});
