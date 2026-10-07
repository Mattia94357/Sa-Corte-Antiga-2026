import { optimizedImage } from './optimizedImage';

// The preload and picture source use these same attributes to avoid two hero downloads.
export const HOME_HERO_ORIGINAL = '/images/HERO sa corte antiga.jpeg';
// Keep enough detail for the tall cover crop, including narrow retina phones.
export const HOME_HERO_SIZES = '(max-width: 767px) max(100vw, 440px), (max-width: 1024px) 1100px, 100vw';
export const homeHeroFallback = optimizedImage(HOME_HERO_ORIGINAL, HOME_HERO_SIZES);
export const homeHeroAvif = {
  media: '(max-width: 1024px)',
  type: 'image/avif',
  src: '/optimized/sa-corte-antiga/hero-sa-corte-antiga-1448.avif',
  srcSet: [480, 768, 1024, 1448].map(width => `/optimized/sa-corte-antiga/hero-sa-corte-antiga-${width}.avif ${width}w`).join(', '),
  sizes: HOME_HERO_SIZES,
};

export const homeHeroPreloads = [
  { ...homeHeroAvif },
  { media: '(min-width: 1025px)', type: 'image/webp', src: homeHeroFallback.src, srcSet: homeHeroFallback.srcSet, sizes: HOME_HERO_SIZES },
];
