import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage as Home } from './HomePage';

const TITLE = 'my-portfolio';

describe('Home', () => {
  it('shows the project title', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(TITLE);
  });
});
