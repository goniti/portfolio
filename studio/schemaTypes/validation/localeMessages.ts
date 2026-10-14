import type { LocaleProblem } from 'portfolio-content-model';
import { localeLabel } from '../locales';

/** Path segment Sanity understands: a field name, or an array item by `_key`. */
type PathSegment = string | { _key: string };

/** A Studio validation error; `path` is relative to the field and empty for the whole field. */
export interface StudioLocaleError {
  message: string;
  path: PathSegment[];
}

function itemPath(itemKey: string | undefined, ...rest: string[]): PathSegment[] {
  return itemKey ? [{ _key: itemKey }, ...rest] : [];
}

/** How the Studio tells an editor about a locale problem, attached to the item when it has one. */
export function toStudioError(problem: LocaleProblem): StudioLocaleError {
  switch (problem.kind) {
    case 'no-language':
      return {
        message: 'Item without a language (legacy v4 format): remove it and add the language again',
        path: itemPath(problem.itemKey),
      };
    case 'unknown-language':
      return {
        message: `Unknown language ${localeLabel(problem.language)}`,
        path: itemPath(problem.itemKey),
      };
    case 'duplicate-locale':
      return {
        message: `${localeLabel(problem.locale)} is set twice`,
        path: itemPath(problem.itemKey),
      };
    case 'blank-value':
      return {
        message: `${localeLabel(problem.locale)} is empty`,
        path: itemPath(problem.itemKey, 'value'),
      };
    case 'missing-locale':
      return { message: `${localeLabel(problem.locale)} translation is required`, path: [] };
  }
}
