import { useLanguage } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-switcher" role="group" aria-label={t('Language')}>
    <button type="button" lang="en" aria-label="English" title="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>
      <svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect width="60" height="40" fill="#012169"/><path d="m0 0 60 40m0-40L0 40" stroke="#fff" strokeWidth="8"/><path d="m0 0 60 40m0-40L0 40" stroke="#c8102e" strokeWidth="3"/><path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="8"/></svg>
    </button>
    <button type="button" lang="it" aria-label="Italiano" title="Italiano" aria-pressed={language === 'it'} onClick={() => setLanguage('it')}>
      <svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><path fill="#009246" d="M0 0h20v40H0z"/><path fill="#fff" d="M20 0h20v40H20z"/><path fill="#ce2b37" d="M40 0h20v40H40z"/></svg>
    </button>
  </div>;
}
