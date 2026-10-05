import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export function NotFound() {
  const { t } = useLanguage();
  return <div className="gallery-page">
    <section className="gallery-hero">
      <div><p>404</p><h1>{t('Page not found')}</h1><span>{t('The requested page is unavailable.')}</span><Link className="text-link" to="/">{t('Home')}</Link></div>
    </section>
  </div>;
}
