import { useLanguage } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-switcher" role="group" aria-label={t('Language')}>
    <button type="button" lang="en" aria-label="English" title="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>ENG</button>
    <button type="button" lang="it" aria-label="Italiano" title="Italiano" aria-pressed={language === 'it'} onClick={() => setLanguage('it')}>ITA</button>
  </div>;
}
