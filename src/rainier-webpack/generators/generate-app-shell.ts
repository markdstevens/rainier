import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { writeFileSync } from 'fs';

export const generateAppShell = (rainierRc: RainierRC): void => {
  let appShell = `import { FC } from 'react';

  export const AppShell: FC = ({ children }) => <>{children}</>;
`;

  if (rainierRc.appShell) {
    appShell = `import React, { FC } from 'react';
import AppShell from '${rainierRc.appShell}';

export const AppShellWrapper: FC = ({ children }) => <AppShell>{children}</AppShell>;
AppShellWrapper.displayName = 'AppShellWrapper';
`;
  }

  writeFileSync(path.join(__dirname, '../../../src/rainier-components/app-shell.tsx'), appShell);
};
