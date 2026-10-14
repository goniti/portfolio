import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/shared/lib/i18n';
import { HOME_CONTENT_FIXTURE } from './content.fixture';
import { buildTerminalScript, TERMINAL_SCRIPT_STYLE } from './terminal';

describe('buildTerminalScript', () => {
  it('styles every line of the copy, in both locales', () => {
    const lines = HOME_CONTENT_FIXTURE.hero.terminalScript;
    expect(lines).toHaveLength(TERMINAL_SCRIPT_STYLE.length);
    for (const locale of LOCALES) {
      const script = buildTerminalScript(lines.map((line) => line[locale]));
      expect(script[0]).toEqual({ command: true, tone: 'text', text: 'whoami' });
    }
  });

  it('ignores texts without a style', () => {
    expect(buildTerminalScript(Array.from({ length: 12 }, () => 'line'))).toHaveLength(
      TERMINAL_SCRIPT_STYLE.length,
    );
  });
});
