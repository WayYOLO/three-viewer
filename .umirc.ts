import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'three-viewer',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  proxy: {
    '/model': {
      'target': 'http://192.168.0.122:8013/',
      'changeOrigin': true,
    },
  },
  // more config: https://d.umijs.org/config
});
