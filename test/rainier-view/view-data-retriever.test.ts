import { getAggregateViewData } from 'rainier-view/view-data-retriever';
import type { ViewData } from 'rainier-controller/types';

describe('getAggregateViewData()', () => {
  it('returns default object when no data is supplied', () => {
    expect(getAggregateViewData({}, {})).toStrictEqual({
      pageTitle: '',
      noScriptText: '',
      headTags: [],
      bodyTags: [],
    });
  });

  it('returns route viewData when only route viewData is defined', () => {
    const routeViewData: ViewData = {
      pageTitle: 'foo',
      noScriptText: 'bar',
      headTags: [
        {
          type: 'script',
        },
      ],
      bodyTags: [
        {
          type: 'link',
        },
      ],
    };

    expect(getAggregateViewData({}, routeViewData)).toStrictEqual(routeViewData);
  });

  it('returns controller viewData when only controller viewData is defined', () => {
    const controllerViewData: ViewData = {
      pageTitle: 'foo',
      noScriptText: 'bar',
      headTags: [
        {
          type: 'script',
        },
      ],
      bodyTags: [
        {
          type: 'link',
        },
      ],
    };

    expect(getAggregateViewData(controllerViewData, {})).toStrictEqual(controllerViewData);
  });

  it('returns controller viewData fields when those fields are not present in the route viewData', () => {
    const controllerViewData: ViewData = {
      pageTitle: 'foo',
      noScriptText: 'bar',
      headTags: [
        {
          type: 'script',
        },
      ],
      bodyTags: [
        {
          type: 'link',
        },
      ],
    };

    const routeViewData: ViewData = {
      pageTitle: 'overridden page title',
      headTags: [],
    };

    expect(getAggregateViewData(controllerViewData, routeViewData)).toStrictEqual({
      pageTitle: routeViewData.pageTitle,
      noScriptText: controllerViewData.noScriptText,
      headTags: routeViewData.headTags,
      bodyTags: controllerViewData.bodyTags,
    });
  });

  it('correctly retrieves viewData from functions if supplied', () => {
    const controllerViewData: ViewData = {
      pageTitle: () => 'foo',
      noScriptText: () => 'bar',
      headTags: () => [
        {
          type: 'script',
        },
      ],
      bodyTags: () => [
        {
          type: 'link',
        },
      ],
    };

    const routeViewData: ViewData = {
      pageTitle: () => 'overridden page title',
      headTags: () => [],
    };

    expect(getAggregateViewData(controllerViewData, routeViewData)).toStrictEqual({
      pageTitle: 'overridden page title',
      noScriptText: 'bar',
      headTags: [],
      bodyTags: [
        {
          type: 'link',
        },
      ],
    });
  });
});
