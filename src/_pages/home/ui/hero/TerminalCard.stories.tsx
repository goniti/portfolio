import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { typeScript } from '../../model/typewriter';
import { buildTerminalScript } from '../../model/terminal';
import { heroMessages } from './messages';
import { TerminalCard } from './TerminalCard';

const { terminal } = heroMessages.en;
const { hero } = HOME_CONTENT_FIXTURE;
const script = buildTerminalScript(hero.terminalScript.map((line) => line.en));

const meta = {
  title: 'Pages/Home/TerminalCard',
  component: TerminalCard,
  args: {
    title: terminal.title,
    status: terminal.live,
    prompt: terminal.prompt,
    lines: typeScript(script, 60),
    stats: [
      { label: terminal.stats.clockLabel, value: '14:02:11', tone: 'text' },
      { label: terminal.stats.buildLabel, value: terminal.stats.buildValue, tone: 'green' },
      { label: terminal.stats.focusLabel, value: hero.focus.en, tone: 'indigo' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-120">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TerminalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typing: Story = {};
export const Finished: Story = { args: { lines: typeScript(script, 1000) } };
