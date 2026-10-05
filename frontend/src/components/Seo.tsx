import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getSeoMetadata, seoMetaTags, serializeJsonLd } from '../seo/metadata';

export function Seo() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useLayoutEffect(() => {
    const seo = getSeoMetadata(pathname, language);
    document.title = seo.title;
    document.documentElement.lang = language;
    // Replace only SEO-managed nodes, leaving fonts, icons and hero preloads intact.
    document.head.querySelectorAll('[data-seo]').forEach(node => node.remove());
    for (const tag of seoMetaTags(seo)) {
      const meta = document.createElement('meta');
      if ('property' in tag) meta.setAttribute('property', tag.property!);
      else meta.setAttribute('name', tag.name!);
      meta.content = tag.content;
      meta.dataset.seo = '';
      document.head.append(meta);
    }
    if (seo.canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = seo.canonical;
      link.dataset.seo = '';
      document.head.append(link);
    }
    document.getElementById('seo-structured-data')?.remove();
    if (seo.structuredData) {
      const script = document.createElement('script');
      script.id = 'seo-structured-data';
      script.type = 'application/ld+json';
      script.textContent = serializeJsonLd(seo.structuredData);
      document.head.append(script);
    }
  }, [pathname, language]);
  return null;
}
