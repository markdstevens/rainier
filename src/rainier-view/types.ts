import type { HtmlTag } from 'rainier-controller/types';

interface HtmlTagsFromServerRender {
  headTags: HtmlTag[];
  bodyTags: HtmlTag[];
}

interface HtmlTagManager {
  appendTagsToDOMIfNotAlreadyPresent(tags: HtmlTag[], section: 'body' | 'head'): void;
  initTagRegistryWithHtmlTagsFromServerRender(tags?: HtmlTagsFromServerRender): void;
}

interface NormalizedViewData {
  pageTitle: string;
  noScriptText: string;
  headTags: HtmlTag[];
  bodyTags: HtmlTag[];
}

type FieldFunction<T> = () => T;

export type { HtmlTagsFromServerRender, HtmlTagManager, NormalizedViewData, FieldFunction };
