import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applySeoToHtml, normalizePath, PUBLIC_ROUTES } from './src/seo/metadata';
import { homeHeroPreloads } from './src/constants/homeImageDelivery';

function routeSeo(): Plugin {
  let outputDirectory: string;
  let building = false;
  return {
    name: 'route-seo',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
      building = config.command === 'build';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const withHeroPreload = html.replace('/* HOME_HERO_PRELOADS */ []', JSON.stringify(homeHeroPreloads));
        return applySeoToHtml(withHeroPreload, context.originalUrl ?? '/');
      },
    },
    configurePreviewServer(server) {
      // Match the explicit Vercel rewrites when checking built HTML locally.
      server.middlewares.use(async (request, response, next) => {
        const path = normalizePath(request.url ?? '/');
        if (path === '/' || !PUBLIC_ROUTES.includes(path)) return next();
        try {
          const html = await readFile(resolve(outputDirectory, path.slice(1), 'index.html'), 'utf8');
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        } catch (error) { next(error); }
      });
    },
    async closeBundle() {
      if (!building) return;
      const html = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
      // Static heads serve social crawlers immediately; page bodies remain the existing React SPA.
      for (const path of PUBLIC_ROUTES.filter(path => path !== '/')) {
        const directory = resolve(outputDirectory, path.slice(1));
        await mkdir(directory, { recursive: true });
        await writeFile(resolve(directory, 'index.html'), applySeoToHtml(html, path));
      }
    },
  };
}

export default defineConfig({ plugins: [react(), routeSeo()], server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } } });
