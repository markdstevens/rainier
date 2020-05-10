interface Target {
  client: () => 'web';
  server: () => 'node';
}

export const target: Target = {
  client: () => 'web',
  server: () => 'node',
};
