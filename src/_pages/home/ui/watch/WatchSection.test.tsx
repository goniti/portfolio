import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { WatchSection } from './WatchSection';

const props = {
  title: HOME_CONTENT_FIXTURE.sectionTitles.watch,
  notes: HOME_CONTENT_FIXTURE.notes,
};

describe('WatchSection', () => {
  it('filters the notes by topic', () => {
    render(<WatchSection {...props} />);
    expect(screen.getAllByRole('button', { name: /read note/i })).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'UX' }));
    expect(screen.getAllByRole('button', { name: /read note/i })).toHaveLength(1);
  });

  it('opens a note in a dialog and closes it', () => {
    render(<WatchSection {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /real-time web architectures/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain('WebSockets when both sides talk.');

    fireEvent.click(screen.getByRole('button', { name: /close the note/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
