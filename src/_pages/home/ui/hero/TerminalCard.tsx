import { Box, Flex, Grid, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import type { TerminalTone, TypedLine } from '../../model/typewriter';

const terminalToneVariants = tv({
  variants: {
    tone: {
      text: 'text-terminal-text',
      muted: 'text-terminal-muted',
      cyan: 'text-terminal-cyan',
      green: 'text-terminal-green',
      violet: 'text-terminal-violet',
      indigo: 'text-terminal-indigo',
    },
  },
});

interface TerminalStat {
  label: string;
  value: string;
  tone: TerminalTone | 'indigo';
}

export interface TerminalCardProps {
  title: string;
  status: string;
  prompt: string;
  lines: readonly TypedLine[];
  stats: readonly TerminalStat[];
}

/** Always-dark terminal window: a typed script above a row of live stats. */
export function TerminalCard({ title, status, prompt, lines, stats }: TerminalCardProps) {
  return (
    <Box className="relative min-w-0 grow basis-95">
      <Box
        aria-hidden="true"
        className="absolute -inset-px rounded-3xl bg-terminal-halo opacity-35 blur-lg"
      />
      <Box className="relative overflow-hidden rounded-3xl border border-terminal-edge bg-linear-to-b from-terminal-top to-terminal-bottom text-terminal-text shadow-terminal">
        <Flex align="center" gap="sm" className="border-terminal-line border-b px-4 py-3.5">
          {[0, 1, 2].map((light) => (
            <span
              key={light}
              aria-hidden="true"
              className="size-2.5 rounded-full bg-terminal-light"
            />
          ))}
          <Text
            as="span"
            variant="bodySm"
            className="ml-2.5 font-medium font-mono text-terminal-dim"
          >
            {title}
          </Text>
          <Text
            as="span"
            variant="bodySm"
            className="ml-auto font-medium font-mono text-2xs text-terminal-green"
          >
            {status}
          </Text>
        </Flex>
        <Flex direction="col" className="min-h-59 px-5 pt-5 pb-2 font-mono text-sm leading-relaxed">
          {lines.map((line) => (
            <Text
              key={line.position}
              variant="body"
              className={terminalToneVariants({
                tone: line.tone,
                className: 'whitespace-pre-wrap break-words font-mono leading-relaxed',
              })}
            >
              {line.command ? <span className="text-terminal-prompt">{prompt}</span> : null}
              {line.text}
              {line.hasCaret ? (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-3.5 w-2 bg-terminal-indigo align-text-bottom motion-safe:animate-blink"
                />
              ) : null}
            </Text>
          ))}
        </Flex>
        <Grid
          cols={{ base: 3 }}
          gap="none"
          className="divide-x divide-terminal-line border-terminal-line border-t"
        >
          {stats.map((stat) => (
            <Flex key={stat.label} direction="col" gap="xs" className="px-4.5 py-3.5">
              <Text
                as="span"
                variant="bodySm"
                className="font-medium font-mono text-2xs text-terminal-dim uppercase tracking-wider"
              >
                {stat.label}
              </Text>
              <Text
                as="span"
                variant="bodyLg"
                className={terminalToneVariants({
                  tone: stat.tone,
                  className: 'font-mono font-semibold',
                })}
              >
                {stat.value}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
