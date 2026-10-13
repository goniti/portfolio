import { Box } from 'goniui';

/**
 * Reading progress bar pinned to the top of the viewport. Decorative: the width follows
 * `--scroll-progress`, written by `useScrollSpy`.
 */
export function ScrollProgress() {
  return (
    <Box aria-hidden="true" className="fixed inset-x-0 top-0 z-60 h-0.5 bg-chip">
      <Box className="h-full scroll-progress bg-linear-to-r from-tint-indigo via-tint-cyan to-tint-violet shadow-progress" />
    </Box>
  );
}
