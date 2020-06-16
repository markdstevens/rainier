import type {
  ReactRouterControllerData,
  ControllerMatchResponse,
  RegisteredControllerViewRoute,
} from 'rainier-controller/types';
import type { ParsedQuery } from 'query-string';
import type { match } from 'react-router-dom';

interface ControllerRegistry {
  getReactRouterControllerData: () => ReactRouterControllerData[];
  findControllerAndRoute: (fullPath: string, queryParams: ParsedQuery) => ControllerMatchResponse;
}

interface DataForMatchedRoute {
  route: RegisteredControllerViewRoute;
  match: match<{}>;
  queryParams: ParsedQuery;
}

export type { ControllerRegistry, DataForMatchedRoute };
