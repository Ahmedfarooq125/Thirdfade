import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const markup = renderToString(React.createElement(App));
  const file = path.join(root, 'dist', 'index.html');
  const html = await readFile(file, 'utf8');
  await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
  process.stdout.write('Prerendered ThirdFade page content into dist/index.html\n');
} finally {
  await server.close();
}
