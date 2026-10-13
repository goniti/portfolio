/** User-facing copy of the counter feature: never inline it in JSX. */
export const counterMessages = {
  count: (count: number) => `Count: ${count}`,
} as const;
