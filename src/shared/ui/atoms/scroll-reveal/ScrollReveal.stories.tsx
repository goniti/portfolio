import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex, Grid, Text } from 'goniui';
import { REVEAL, revealStagger } from '../../../lib/motion';
import { ScrollReveal } from './ScrollReveal';

const CARDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const DIRECTIONS = ['up', 'down', 'left', 'right', 'fade', 'zoom'] as const;
const CARD_CLASS = 'rounded-2xl border border-border bg-surface p-8';

function RevealDemo() {
  return (
    <Box as="main" className="overflow-hidden">
      <Flex direction="col" gap="xl" className="p-8">
        <Text className="h-screen text-foreground-muted">Scroll down ↓</Text>
        {DIRECTIONS.map((direction) => (
          <Text key={direction} {...REVEAL[direction]} className={CARD_CLASS}>
            {`REVEAL.${direction}`}
          </Text>
        ))}
        <Flex justify="between" align="end" wrap="wrap" gap="lg" {...REVEAL.columns}>
          <Text as="h2" className="text-3xl font-bold">
            Heading from the left
          </Text>
          <Text className="text-foreground-muted">Action from the right</Text>
        </Flex>
        <Text tone="muted">Two columns: each side from its own side, row by row.</Text>
        <Grid as="ul" cols={{ base: 1, md: 2 }} gap="lg" {...REVEAL.columns}>
          {CARDS.map((card) => (
            <li key={card} className={CARD_CLASS}>
              {card}
            </li>
          ))}
        </Grid>
        <Text tone="muted">Three columns with a zoom: left, up and right per row.</Text>
        <Grid
          as="ul"
          cols={{ base: 1, md: 3 }}
          gap="lg"
          {...revealStagger({ from: 'columns', zoom: true })}
        >
          {CARDS.map((card) => (
            <li key={card} className={CARD_CLASS}>
              {card}
            </li>
          ))}
        </Grid>
        <Text tone="muted">Rows rising with a zoom, a row at a time.</Text>
        <Grid
          as="ul"
          cols={{ base: 1, md: 3 }}
          gap="lg"
          {...revealStagger({ from: 'rows', zoom: true })}
        >
          {CARDS.map((card) => (
            <li key={card} className={CARD_CLASS}>
              {card}
            </li>
          ))}
        </Grid>
        <Text tone="muted">Notes dropping in from above, one after the other.</Text>
        <Grid as="ul" cols={{ base: 1, md: 4 }} gap="md" {...revealStagger({ from: 'down' })}>
          {CARDS.slice(0, 4).map((card) => (
            <li key={card} className={CARD_CLASS}>
              {card}
            </li>
          ))}
        </Grid>
        <Text tone="muted">A list sliding in from the left, one item after the other.</Text>
        <Flex as="ol" direction="col" gap="md" {...revealStagger({ from: 'left' })}>
          {CARDS.slice(0, 4).map((card) => (
            <li key={card} className={CARD_CLASS}>
              {card}
            </li>
          ))}
        </Flex>
      </Flex>
      <ScrollReveal />
    </Box>
  );
}

const meta = {
  title: 'Shared/Atoms/ScrollReveal',
  component: ScrollReveal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Spread a marker on content below the fold, then mount `<ScrollReveal />` once. `REVEAL.up|down|left|right|fade|zoom` (or `reveal({ from, zoom })`) plays the element; `revealStagger({ from, zoom })` plays its children one after the other, and `from: "columns"` (`REVEAL.columns`) sends each child in from the side of the layout it sits on, a row at a time, falling back to `up` on a single column; `from: "rows"` raises the children a row at a time. Sideways offsets need an `overflow-hidden` ancestor. Content stays visible without JavaScript and with reduced motion.',
      },
    },
  },
  render: () => <RevealDemo />,
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
