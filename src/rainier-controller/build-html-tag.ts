import { HtmlTag } from './types';

export function buildHtmlTag({ type, content, attributes = {} }: HtmlTag): string {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
    .join(' ');

  return `<${type} ${attrs}>${content}</${type}>`;
}
