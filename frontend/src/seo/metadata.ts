import { EXTERNAL_LINKS } from '../constants/links';

export const SITE_ORIGIN = 'https://sacorteantiga.com';
export type SeoLanguage = 'en' | 'it';
type Copy = { title: string; description: string };
type Page = { en: Copy; it: Copy; gardenHouse?: boolean; gallery?: boolean; contact?: boolean };

export const SEO_PAGES: Record<string, Page> = {
  '/': {
    en: {
      title: 'Sa Corte Antiga | Holiday Home in Nebida, Sardinia',
      description: 'Sa Corte Antiga is a quiet holiday home in Nebida, South-West Sardinia, with private outdoor space and easy access to the sea, coastal walks and climbing.',
    },
    it: {
      title: 'Sa Corte Antiga | Casa vacanze a Nebida, Sardegna',
      description: 'Sa Corte Antiga è una casa vacanze tranquilla a Nebida, nella Sardegna sud-occidentale, con spazi esterni privati e facile accesso al mare, ai sentieri costieri e alle zone di arrampicata.',
    },
  },
  '/why-sa-corte-antiga': {
    en: {
      title: 'Why Sa Corte Antiga | Nebida, South-West Sardinia',
      description: 'Discover Nebida and South-West Sardinia from Sa Corte Antiga: nearby beaches, coastal walks, Mediterranean landscapes and rock climbing by the sea.',
    },
    it: {
      title: 'Perché Sa Corte Antiga | Nebida, Sardegna sud-occidentale',
      description: 'Scopri Nebida e la Sardegna sud-occidentale da Sa Corte Antiga: spiagge vicine, sentieri costieri, paesaggi mediterranei e arrampicata sul mare.',
    },
  },
  '/gallery': {
    gallery: true,
    en: {
      title: 'Sa Corte Antiga Gallery | Nebida, Sardinia',
      description: 'Explore real photographs of Sa Corte Antiga in Nebida, Sardinia: the private garden, shaded terrace, bedrooms, kitchen and indoor living spaces.',
    },
    it: {
      title: 'Galleria Sa Corte Antiga | Nebida, Sardegna',
      description: 'Guarda le fotografie di Sa Corte Antiga a Nebida, in Sardegna: il giardino privato, la terrazza ombreggiata, le camere, la cucina e gli spazi interni.',
    },
  },
  '/contact': {
    contact: true,
    en: {
      title: 'Contact Sa Corte Antiga | Nebida, Sardinia',
      description: 'Contact Sa Corte Antiga in Nebida, South-West Sardinia. Send your travel dates or questions about the house and planning your stay near the coast.',
    },
    it: {
      title: 'Contatta Sa Corte Antiga | Nebida, Sardegna',
      description: 'Contatta Sa Corte Antiga a Nebida, nella Sardegna sud-occidentale. Invia le date del viaggio o le tue domande sulla casa e sul soggiorno vicino alla costa.',
    },
  },
  '/garden-house': {
    gardenHouse: true,
    en: {
      title: 'Garden House | Sea-View Stay in Sardinia | Coming Soon',
      description: 'Garden House is a sea-view stay coming soon on the south-west coast of Sardinia. Take a first look at the covered terrace, outdoor spaces and interiors.',
    },
    it: {
      title: 'Garden House | Soggiorno vista mare in Sardegna | Prossimamente',
      description: 'Garden House è un soggiorno vista mare in arrivo sulla costa sud-occidentale della Sardegna. Scopri la terrazza coperta, gli spazi esterni e gli interni.',
    },
  },
  '/garden-house/gallery': {
    gardenHouse: true,
    gallery: true,
    en: {
      title: 'Garden House Gallery | Sardinia',
      description: 'Browse real photographs of Garden House in Sardinia: the sea-view veranda, sheltered terrace and interiors of this coming-soon stay.',
    },
    it: {
      title: 'Galleria Garden House | Sardegna',
      description: 'Guarda le fotografie di Garden House in Sardegna: la veranda vista mare, la terrazza riparata e gli interni di questo soggiorno in arrivo.',
    },
  },
};

export const PUBLIC_ROUTES = Object.keys(SEO_PAGES);
const propertyImage = '/optimized/sa-corte-antiga/hero-sa-corte-antiga-1448.webp';
const gardenImage = '/optimized/garden-house/outsideviewgardenhouse-1086.webp';
export const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).href;
export const normalizePath = (path: string) => (path.split(/[?#]/)[0].replace(/\/+$/, '') || '/').toLowerCase();

export function getSeoMetadata(pathname: string, language: SeoLanguage = 'en') {
  const path = normalizePath(pathname);
  const page = Object.hasOwn(SEO_PAGES, path) ? SEO_PAGES[path] : undefined;
  const copy = page?.[language] ?? (language === 'it'
    ? { title: 'Pagina non trovata | Sa Corte Antiga', description: 'La pagina richiesta non è disponibile. Torna al sito di Sa Corte Antiga.' }
    : { title: 'Page not found | Sa Corte Antiga', description: 'The requested page is unavailable. Return to the Sa Corte Antiga website.' });
  const canonical = page ? absoluteUrl(path) : null;
  const image = absoluteUrl(page?.gardenHouse ? gardenImage : propertyImage);
  const siteName = page?.gardenHouse ? 'Garden House' : 'Sa Corte Antiga';
  const structuredData = page ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': page.gallery ? 'CollectionPage' : page.contact ? 'ContactPage' : 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: copy.title,
        description: copy.description,
        inLanguage: language,
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        // Garden House is a coming-soon page; no operational lodging entity is asserted.
        ...(!page.gardenHouse ? { about: { '@id': `${SITE_ORIGIN}/#lodging` } } : {}),
      },
      ...(!page.gardenHouse ? [{
        '@type': 'LodgingBusiness',
        '@id': `${SITE_ORIGIN}/#lodging`,
        name: 'Sa Corte Antiga',
        url: `${SITE_ORIGIN}/`,
        telephone: '+39 340 360 6054',
        address: { '@type': 'PostalAddress', addressLocality: 'Nebida', addressRegion: 'Sardegna', addressCountry: 'IT' },
        image: [absoluteUrl(propertyImage), absoluteUrl('/optimized/sa-corte-antiga/img-20240113-wa0007-1280.webp')],
        // Strip tracking parameters only in schema; approved booking links remain untouched.
        sameAs: [EXTERNAL_LINKS.airbnb, EXTERNAL_LINKS.booking, EXTERNAL_LINKS.agoda].map(link => link.split('?')[0]),
      }] : []),
    ],
  } : null;
  return {
    ...copy, canonical, image, siteName, structuredData,
    imageWidth: page?.gardenHouse ? 1086 : 1448,
    imageHeight: page?.gardenHouse ? 1448 : 1086,
    imageAlt: page?.gardenHouse
      ? (language === 'it' ? 'Esterno e veranda coperta di Garden House' : 'Garden House exterior and covered veranda')
      : (language === 'it' ? 'Terrazza ombreggiata e tavolo esterno di Sa Corte Antiga' : 'Sa Corte Antiga shaded terrace and outdoor table'),
    locale: language === 'it' ? 'it_IT' : 'en_GB',
    robots: page ? 'index, follow, max-image-preview:large' : 'noindex, follow',
  };
}

export function seoMetaTags(seo: ReturnType<typeof getSeoMetadata>) {
  return [
    { name: 'description', content: seo.description },
    { name: 'robots', content: seo.robots },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:type', content: 'website' },
    ...(seo.canonical ? [{ property: 'og:url', content: seo.canonical }] : []),
    { property: 'og:image', content: seo.image },
    { property: 'og:image:width', content: String(seo.imageWidth) },
    { property: 'og:image:height', content: String(seo.imageHeight) },
    { property: 'og:image:alt', content: seo.imageAlt },
    { property: 'og:site_name', content: seo.siteName },
    { property: 'og:locale', content: seo.locale },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: seo.image },
    { name: 'twitter:image:alt', content: seo.imageAlt },
  ];
}

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Shared by Vite's initial HTML and the generated production route documents. */
export function applySeoToHtml(html: string, pathname: string) {
  const seo = getSeoMetadata(pathname);
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    ...seoMetaTags(seo).map(tag => `<meta ${'property' in tag ? `property="${tag.property}"` : `name="${tag.name}"`} content="${escapeHtml(tag.content)}" data-seo/>`),
    ...(seo.canonical ? [`<link rel="canonical" href="${escapeHtml(seo.canonical)}" data-seo/>`] : []),
    ...(seo.structuredData ? [`<script id="seo-structured-data" type="application/ld+json">${serializeJsonLd(seo.structuredData)}</script>`] : []),
  ].join('\n  ');
  return html.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, `<!-- SEO:START -->\n  ${tags}\n  <!-- SEO:END -->`);
}
