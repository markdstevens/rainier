export const appShellTs = `import React, { FC } from "react";

const AppShell: FC = ({ children }) => (
  <>
    <div>Header</div>
      {children}
    <div>Footer</div>
  </>
);

export default AppShell;
`;
