/** Brand tints, mirrored from `src/_pages/home/model/tints.ts` (drift fails the content check). */
const TINTS = ['indigo', 'cyan', 'violet', 'emerald', 'sky', 'amber'] as const;

type Tint = (typeof TINTS)[number];

export function tintOptions(allowed: readonly Tint[] = TINTS) {
  return { list: allowed.map((tint) => ({ title: tint, value: tint })), layout: 'radio' as const };
}
