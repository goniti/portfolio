import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Counter } from './Counter';
import { counterMessages } from './messages';

describe('Counter', () => {
  it('increments the counter', () => {
    render(<Counter />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button.textContent).toBe(counterMessages.count(1));
  });
});
