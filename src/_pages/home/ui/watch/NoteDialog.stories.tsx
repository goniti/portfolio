import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { watchMessages } from './messages';
import { NoteDialog } from './NoteDialog';

const copy = watchMessages.en;

const meta = {
  title: 'Pages/Home/NoteDialog',
  component: NoteDialog,
  args: {
    note: {
      ...copy.notes['server-components'],
      tint: 'cyan',
      meta: copy.dialogMeta(copy.filters['front-end'], copy.notes['server-components'].date, 6),
    },
    onClose: fn(),
    copy,
  },
} satisfies Meta<typeof NoteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
