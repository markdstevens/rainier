import { HtmlTag } from 'rainier-controller';

const elementRegistry = new Set();

function getHtmlTagCacheKey({ type, content, attributes }: HtmlTag): string {
  return `type=${type} content=${content} attributes=${JSON.stringify(attributes)}`;
}

export function appendTagsToDOMIfNotAlreadyPresent(
  tags: HtmlTag[],
  section: 'body' | 'head'
): void {
  tags.forEach((tag) => {
    const { type, content = '', attributes = {} } = tag;
    const element = document.createElement(type);
    element.textContent = content;

    Object.entries(attributes).forEach(([key, val]) => {
      (element as any)[key] = val;
    });

    const cacheKey = getHtmlTagCacheKey(tag);
    if (!elementRegistry.has(cacheKey)) {
      elementRegistry.add(cacheKey);
      document[section].appendChild(element);
    }
  });
}

interface HtmlTagsFromServerRender {
  headTags: HtmlTag[];
  bodyTags: HtmlTag[];
}

export function initTagRegistryWithHtmlTagsFromServerRender(tags: HtmlTagsFromServerRender): void {
  const serverHtmlTags = tags ?? { headTags: [], bodyTags: [] };
  [...serverHtmlTags.headTags, ...serverHtmlTags.bodyTags].forEach((tag) => {
    elementRegistry.add(getHtmlTagCacheKey(tag));
  });
}
