import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Grid, Text } from 'goniui';
import { surfaceVariants } from '../surface';
import { CursorFollower } from './CursorFollower';
import { CARD_CURSOR_TARGET } from './cursorPhysics';

const CARDS = ['Rust at the edge', 'React compiler notes', 'Agents in CI'];

function CardDemo() {
  return (
    <>
      <Grid cols={{ base: 1, md: 3 }} gap="lg" className="p-8">
        {CARDS.map((card) => (
          <Button
            key={card}
            variant="unstyled"
            size="none"
            {...CARD_CURSOR_TARGET}
            className={surfaceVariants({
              radius: 'md',
              className: 'h-48 flex-col items-start justify-end gap-2 p-6 text-left',
            })}
          >
            <Text as="span" variant="h2" className="text-lg font-bold">
              {card}
            </Text>
            <Text as="span" variant="body" tone="muted">
              Hover: the follower outlines the whole card.
            </Text>
          </Button>
        ))}
      </Grid>
      <CursorFollower />
    </>
  );
}

const meta = {
  title: 'Shared/Atoms/CursorFollower',
  component: CursorFollower,
  parameters: {
    docs: {
      description: {
        component:
          'Move the mouse over the canvas: the dot springs after the pointer and wraps small buttons. Spread `CARD_CURSOR_TARGET` on a card to have the follower outline it whole, matching its corners. Hidden on touch screens and with reduced motion.',
      },
    },
  },
} satisfies Meta<typeof CursorFollower>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Cards: Story = { render: () => <CardDemo /> };
