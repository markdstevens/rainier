export const appShellJs = `import React from "react";

const AppShell = ({ children }) => (
  <>
    <div>Header</div>
    {children}
    <div>Footer</div>
  </>
);

export default AppShell;
`;
