'use client';

import { useState } from 'react';
import { Button } from 'goniui';
import { counterMessages } from './messages';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount((current) => current + 1)}>
      {counterMessages.count(count)}
    </Button>
  );
}
