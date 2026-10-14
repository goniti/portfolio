import { TINTS, type Tint } from 'portfolio-content-model';

export function tintOptions(allowed: readonly Tint[] = TINTS) {
  return { list: allowed.map((tint) => ({ title: tint, value: tint })), layout: 'radio' as const };
}
