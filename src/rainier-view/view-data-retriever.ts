import type { ViewData, ViewDataOption, ViewDataFetchOptions } from 'rainier-controller/types';
import type { FieldFunction, NormalizedViewData } from './types';

function isFieldFunction<T>(field: any): field is FieldFunction<T> {
  return typeof field === 'function';
}

const getOrRunFunction = function <T>(
  fetchOptions: ViewDataFetchOptions,
  fieldOrFunc?: T | FieldFunction<T>
): T | undefined {
  if (!fieldOrFunc) {
    return undefined;
  }

  return isFieldFunction(fieldOrFunc) ? fieldOrFunc(fetchOptions) : fieldOrFunc;
};

function getNormalizedViewData(
  fetchOptions: ViewDataFetchOptions,
  viewDataOption?: ViewDataOption
): NormalizedViewData {
  const viewData = getOrRunFunction<ViewData>(fetchOptions, viewDataOption);

  return JSON.parse(
    JSON.stringify({
      pageTitle: viewData?.pageTitle,
      noScriptText: viewData?.noScriptText,
      headTags: viewData?.headTags,
      bodyTags: viewData?.bodyTags,
    })
  );
}

export function getAggregateViewData(
  controllerViewData: ViewDataOption,
  routeViewData: ViewDataOption,
  fetchOptions: ViewDataFetchOptions
): NormalizedViewData {
  const normalizedRouteViewData = getNormalizedViewData(fetchOptions, routeViewData);
  const normalizedControllerViewData = getNormalizedViewData(fetchOptions, controllerViewData);

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
