import type { ViewData, HtmlTag } from 'rainier-controller/types';
import type { FieldFunction, NormalizedViewData } from './types';

function isFieldFunction<T>(field: any): field is FieldFunction<T> {
  return typeof field === 'function';
}

const getOrRunFunction = function <T>(fieldOrFunc?: T | FieldFunction<T>): T | undefined {
  if (!fieldOrFunc) {
    return undefined;
  }

  return isFieldFunction(fieldOrFunc) ? fieldOrFunc() : fieldOrFunc;
};

function getNormalizedViewData(viewData?: ViewData): NormalizedViewData {
  return JSON.parse(
    JSON.stringify({
      pageTitle: getOrRunFunction<string>(viewData?.pageTitle),
      noScriptText: getOrRunFunction<string>(viewData?.noScriptText),
      headTags: getOrRunFunction<HtmlTag[]>(viewData?.headTags),
      bodyTags: getOrRunFunction<HtmlTag[]>(viewData?.bodyTags),
    })
  );
}

export function getAggregateViewData(
  controllerViewData: ViewData,
  routeViewData: ViewData
): NormalizedViewData {
  const normalizedRouteViewData = getNormalizedViewData(routeViewData);
  const normalizedControllerViewData = getNormalizedViewData(controllerViewData);

  return Object.assign(
    {
      pageTitle: '',
      noScriptText: '',
      headTags: [],
      bodyTags: [],
    },
    normalizedControllerViewData,
    normalizedRouteViewData
  );
}
