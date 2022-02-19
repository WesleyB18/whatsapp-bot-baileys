export const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: 'current'
      }
    }
  ],
  '@babel/preset-typescript'
];
export const plugins = [
  ['module-resolver', {
    alias: {
      '@config': './src/config'
    }
  }]
];
export const ignore = [
  '**/*.spec.ts'
];
