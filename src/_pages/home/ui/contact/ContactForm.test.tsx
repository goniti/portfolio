import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './ContactForm';

function fill(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('ContactForm', () => {
  it('shows the validation errors and does not send', async () => {
    const openMailto = vi.fn();
    render(<ContactForm openMailto={openMailto} />);
    fill(/name/i, 'J');
    fill(/email/i, 'nope');
    fill(/message/i, 'Hi');
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('min. 2 characters')).toBeTruthy();
    expect(screen.getByText('enter a valid email')).toBeTruthy();
    expect(screen.getByText('8 more characters')).toBeTruthy();
    expect(screen.getByLabelText(/name/i).getAttribute('aria-invalid')).toBe('true');
    expect(openMailto).not.toHaveBeenCalled();
  });

  it('opens the mail app with the message, then confirms', async () => {
    const openMailto = vi.fn();
    render(<ContactForm openMailto={openMailto} />);
    fill(/name/i, 'Jane');
    fill(/email/i, 'jane@company.com');
    fill(/message/i, 'Let us talk about a tech lead role.');
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(openMailto).toHaveBeenCalledOnce());
    expect(String(openMailto.mock.calls[0]?.[0])).toMatch(
      /^mailto:gonzalezlovullocarlos@gmail\.com\?/,
    );
    expect(await screen.findByRole('heading', { name: /your email is ready/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /send another/i }));
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
  });
});
