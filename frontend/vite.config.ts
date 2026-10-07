import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applySeoToHtml, normalizePath, PUBLIC_ROUTES } from './src/seo/metadata';
import { homeHeroPreloads } from './src/constants/homeImageDelivery';

function applyHomeHeroPreload(html: string, pathname: string) {
  const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const links = normalizePath(pathname) === '/' ? homeHeroPreloads.map(hero =>
    `<link rel="preload" as="image" type="${attribute(hero.type)}" media="${attribute(hero.media)}" href="${attribute(hero.src)}" imagesrcset="${attribute(hero.srcSet)}" imagesizes="${attribute(hero.sizes)}" fetchpriority="high"/>`
  ).join('\n  ') : '';
  return html.replace(/<!-- HOME_HERO_PRELOAD:START -->[\s\S]*?<!-- HOME_HERO_PRELOAD:END -->/,
    `<!-- HOME_HERO_PRELOAD:START -->\n  ${links}\n  <!-- HOME_HERO_PRELOAD:END -->`);
}

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
        const withHeroPreload = applyHomeHeroPreload(html, context.originalUrl ?? '/');
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
        await writeFile(resolve(directory, 'index.html'), applySeoToHtml(applyHomeHeroPreload(html, path), path));
      }
    },
  };
}

export default defineConfig({ plugins: [react(), routeSeo()], server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } } });
