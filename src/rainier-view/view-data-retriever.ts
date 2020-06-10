import { ControllerMatchResponse, ViewData, HtmlTag } from 'rainier-controller';

interface NormalizedViewData {
  pageTitle: string;
  noScriptText: string;
  headTags: HtmlTag[];
  bodyTags: HtmlTag[];
}

type FieldFunction<T> = (controllerMatch: ControllerMatchResponse) => T;
function isFieldFunction<T>(field: any): field is FieldFunction<T> {
  return typeof field === 'function';
}

const getOrRunFunction = function <T>(
  controllerMatch: ControllerMatchResponse,
  fieldOrFunc?: T | FieldFunction<T>
): T | undefined {
  if (!fieldOrFunc) {
    return undefined;
  }

  return isFieldFunction(fieldOrFunc) ? fieldOrFunc(controllerMatch) : fieldOrFunc;
};

function getNormalizedViewData(
  controllerMatch: ControllerMatchResponse,
  viewData?: ViewData
): NormalizedViewData {
  return JSON.parse(
    JSON.stringify({
      pageTitle: getOrRunFunction<string>(controllerMatch, viewData?.pageTitle),
      noScriptText: getOrRunFunction<string>(controllerMatch, viewData?.noScriptText),
      headTags: getOrRunFunction<HtmlTag[]>(controllerMatch, viewData?.headTags),
      bodyTags: getOrRunFunction<HtmlTag[]>(controllerMatch, viewData?.bodyTags),
    })
  );
}

export function getViewDataFromControllerMatch(
  controllerMatch: ControllerMatchResponse
): NormalizedViewData {
  const normalizedRouteViewData = getNormalizedViewData(
    controllerMatch,
    controllerMatch?.routeViewData
  );

  const normalizedControllerViewData = getNormalizedViewData(
    controllerMatch,
    controllerMatch?.controller?.viewData
  );

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
