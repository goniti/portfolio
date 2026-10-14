import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { formatMonthYear } from '../../model/format';
import { watchMessages } from './messages';
import { NoteDialog } from './NoteDialog';

const copy = watchMessages.en;
const note = HOME_CONTENT_FIXTURE.notes[1];

const meta = {
  title: 'Pages/Home/NoteDialog',
  component: NoteDialog,
  args: {
    note: note
      ? {
          title: note.title.en,
          excerpt: note.excerpt.en,
          body: note.body.map((paragraph) => paragraph.en),
          takeaways: note.takeaways.map((takeaway) => takeaway.en),
          tint: 'cyan',
          meta: copy.dialogMeta(
            copy.filters[note.category],
            formatMonthYear(note.publishedAt, 'en'),
            note.readingMinutes,
          ),
        }
      : null,
    onClose: fn(),
    copy,
  },
} satisfies Meta<typeof NoteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
