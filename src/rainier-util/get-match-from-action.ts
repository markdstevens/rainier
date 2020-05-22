import { matchPath, match } from 'react-router-dom';

export const getMatchFromAction = (
  action: { fullPaths: string[]; paths: string[] },
  fullPath: string,
  pathsKey: 'fullPaths' | 'paths' = 'fullPaths'
): match<{}> | null | undefined =>
  action[pathsKey]
    .map((path) =>
      matchPath(fullPath, {
        path,
        exact: true,
      })
    )
    .find((match) => match?.isExact);
