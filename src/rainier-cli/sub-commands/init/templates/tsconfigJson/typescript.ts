export const tsconfig = `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": ["ESNext", "dom"],
    "moduleResolution": "node",
    "jsx": "react",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": "src",
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "strict": true,
    "isolatedModules": true,
    "declaration": true,
    "outDir": "dist",
    "paths": {
      "stores/*": ["stores/*"],
      "views/*": ["views/*"]
    }
  }
}
`;
