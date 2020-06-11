import { HtmlTag } from 'rainier-controller';

function buildHtmlTag({ type, content, attributes = {} }: HtmlTag): string {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
    .join(' ');

  return `<${type} ${attrs}>${content}</${type}>`;
}

function toFormattedString(tags: string[]): string {
  return tags.join('\n').trim();
}

export function buildHtmlTags(clientTags: HtmlTag[], ...webpackTags: string[]): string {
  return (
    toFormattedString(clientTags.map((clientTag) => buildHtmlTag(clientTag))) +
    toFormattedString(webpackTags)
  );
}
