import { matchPath } from 'react-router-dom';
import type { match } from 'react-router-dom';

export const getMatchFromRoute = (
  route: { fullPaths: string[]; paths: string[] },
  fullPath: string,
  pathsKey: 'fullPaths' | 'paths' = 'fullPaths'
): match<{}> | null | undefined =>
  route[pathsKey]
    .map((path) =>
      matchPath(fullPath, {
        path,
        exact: true,
      })
    )
    .find((match) => match?.isExact);
