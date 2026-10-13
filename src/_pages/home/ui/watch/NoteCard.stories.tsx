import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { watchMessages } from './messages';
import { NoteCard } from './NoteCard';

const copy = watchMessages.en;
const note = copy.notes['ai-workflows'];

const meta = {
  title: 'Pages/Home/NoteCard',
  component: NoteCard,
  args: {
    category: copy.categoryTag(copy.filters.ai),
    tint: 'violet',
    meta: copy.cardMeta(note.date, 5),
    title: note.title,
    excerpt: note.excerpt,
    cta: copy.readNote,
    onOpen: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
