import { buildHtmlTags } from './html-tag-builder';
import type { ChunkExtractor } from '@loadable/server';
import type { NormalizedViewData } from 'rainier-view/types';

export interface ServerViewData {
  pageTitle: string;
  noScriptText: string;
  headTags: string;
  bodyTags: string;
  htmlTags: string;
}

export function adaptViewDataForServer(
  { pageTitle, noScriptText, headTags, bodyTags }: NormalizedViewData,
  extractor: ChunkExtractor
): ServerViewData {
  return {
    pageTitle,
    noScriptText,
    headTags: buildHtmlTags(headTags, extractor.getLinkTags(), extractor.getStyleTags()),
    bodyTags: buildHtmlTags(bodyTags, extractor.getScriptTags()),
    htmlTags: JSON.stringify({
      headTags,
      bodyTags,
    }),
  };
}
