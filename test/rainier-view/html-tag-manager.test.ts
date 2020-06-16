import { initHtmlTagManager } from 'rainier-view/html-tag-manager';
import type { HtmlTag } from 'index';
import type { HtmlTagsFromServerRender } from 'rainier-view/types';

describe('htmlTagManager', () => {
  let originalAppendChildBody: any;
  let originalAppendChildHead: any;

  beforeAll(() => {
    originalAppendChildBody = document.body.appendChild;
    originalAppendChildHead = document.head.appendChild;
  });

  beforeEach(() => {
    document.body.appendChild = jest.fn();
    document.head.appendChild = jest.fn();
  });

  afterAll(() => {
    document.body.appendChild = originalAppendChildBody;
    document.head.appendChild = originalAppendChildHead;
  });

  describe('appendTagsToDOMIfNotAlreadyPresent()', () => {
    it('should add tags to cache if not already present', async () => {
      const htmlTagManager = initHtmlTagManager();
      const scriptTag: HtmlTag = {
        type: 'script',
        attributes: {
          'data-testid': 'script-0',
        },
      };

      const tags: HtmlTag[] = [scriptTag];
      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent(tags, 'body');

      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    });

    it('should not append tags when tags have already been added', () => {
      const htmlTagManager = initHtmlTagManager();
      const scriptTag: HtmlTag = {
        type: 'script',
      };

      const styleTag: HtmlTag = {
        type: 'style',
      };

      const linkTag: HtmlTag = {
        type: 'link',
      };

      const tags: HtmlTagsFromServerRender = {
        headTags: [scriptTag],
        bodyTags: [styleTag],
      };

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender(tags);
      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent([scriptTag, styleTag, linkTag], 'body');

      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    });

    it('triggers cache miss when only type of tag is different', () => {
      const htmlTagManager = initHtmlTagManager();
      const linkTag: HtmlTag = {
        type: 'link',
        content: 'foo',
        attributes: {
          'data-testid': 'bar',
        },
      };

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender({
        headTags: [linkTag],
        bodyTags: [],
      });

      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent(
        [Object.assign({}, linkTag, { type: 'script' })],
        'body'
      );

      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    });

    it('triggers cache miss when only content of tag is different', () => {
      const htmlTagManager = initHtmlTagManager();
      const linkTag: HtmlTag = {
        type: 'link',
        content: 'foo',
        attributes: {
          'data-testid': 'bar',
        },
      };

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender({
        headTags: [linkTag],
        bodyTags: [],
      });

      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent(
        [Object.assign({}, linkTag, { content: 'bar' })],
        'body'
      );

      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    });

    it('triggers cache miss when only attributes of tag are different', () => {
      const htmlTagManager = initHtmlTagManager();
      const linkTag: HtmlTag = {
        type: 'link',
        content: 'foo',
        attributes: {
          'data-testid': 'bar',
        },
      };

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender({
        headTags: [linkTag],
        bodyTags: [],
      });

      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent(
        [
          Object.assign({}, linkTag, {
            attributes: {
              'data-testid': 'foo',
            },
          }),
        ],
        'body'
      );

      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    });

    it('triggers cache hit when every part of the tag is identical', () => {
      const htmlTagManager = initHtmlTagManager();
      const linkTag: HtmlTag = {
        type: 'link',
        content: 'foo',
        attributes: {
          'data-testid': 'bar',
        },
      };

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender({
        headTags: [linkTag],
        bodyTags: [],
      });

      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent([Object.assign({}, linkTag)], 'body');

      expect(document.body.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('initTagRegistryWithHtmlTagsFromServerRender()', () => {
    it('should not break when there are no initial server tags', () => {
      const htmlTagManager = initHtmlTagManager();

      htmlTagManager.initTagRegistryWithHtmlTagsFromServerRender(undefined);
      htmlTagManager.appendTagsToDOMIfNotAlreadyPresent(
        [
          {
            type: 'script',
          },
          {
            type: 'style',
          },
          {
            type: 'link',
          },
        ],
        'body'
      );

      expect(document.body.appendChild).toHaveBeenCalledTimes(3);
    });
  });
});
