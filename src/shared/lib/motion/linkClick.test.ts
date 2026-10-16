import { afterEach, describe, expect, it } from 'vitest';
import { isPlainLinkClick } from './linkClick';

const SELECTOR = 'a[href="#experience"]';

/** Dispatches a click on the element and returns what the rule says about it. */
function judgeClick(element: Element, init: MouseEventInit = {}, isHandled = false): boolean {
  let verdict = false;
  const judge = (event: MouseEvent) => {
    verdict = isPlainLinkClick(event, SELECTOR);
  };
  document.addEventListener('click', judge);
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
  if (isHandled) event.preventDefault();
  element.dispatchEvent(event);
  document.removeEventListener('click', judge);
  return verdict;
}

function addLink(href: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  document.body.append(link);
  return link;
}

describe('isPlainLinkClick', () => {
  afterEach(() => document.body.replaceChildren());

  it('accepts a plain left click on a matching link or its content', () => {
    const link = addLink('#experience');
    const label = document.createElement('span');
    link.append(label);

    expect(judgeClick(link)).toBe(true);
    expect(judgeClick(label)).toBe(true);
  });

  it('ignores links that do not match the selector', () => {
    expect(judgeClick(addLink('#skills'))).toBe(false);
    expect(judgeClick(document.body)).toBe(false);
  });

  it.each([
    ['ctrl', { ctrlKey: true }],
    ['meta', { metaKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('leaves a %s click to the browser', (_name, init) => {
    expect(judgeClick(addLink('#experience'), init)).toBe(false);
  });

  it('ignores a click another handler already cancelled', () => {
    expect(judgeClick(addLink('#experience'), {}, true)).toBe(false);
  });
});
