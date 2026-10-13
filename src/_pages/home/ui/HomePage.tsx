import { Flex, Text } from 'goniui';
import { Counter } from './counter/Counter';
import { appMessages } from './messages';

export function HomePage() {
  return (
    <Flex as="main" direction="col" align="start" gap="lg" className="mx-auto my-16 max-w-2xl px-4">
      <Text variant="title" as="h1">
        {appMessages.title}
      </Text>
      <Text tone="muted">{appMessages.lead}</Text>
      <Counter />
    </Flex>
  );
}
