import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { formatMonthYear } from '../../model/format';
import { watchMessages } from './messages';
import { NoteCard } from './NoteCard';

const copy = watchMessages.en;
const [note] = HOME_CONTENT_FIXTURE.notes;

const meta = {
  title: 'Pages/Home/NoteCard',
  component: NoteCard,
  args: {
    category: copy.categoryTag(copy.filters.ai),
    tint: 'violet',
    meta: copy.cardMeta(note ? formatMonthYear(note.publishedAt, 'en') : '', 5),
    title: note?.title.en ?? '',
    excerpt: note?.excerpt.en ?? '',
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
