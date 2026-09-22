import { useLanguage } from '../i18n/LanguageContext';
import { NavLink } from 'react-router-dom';

export function GardenHouseNav() {
  const { t } = useLanguage();
  return <nav className="garden-subnav" aria-label={t("Garden House navigation")}>
    <NavLink to="/garden-house" end>{t("Home")}</NavLink>
    <NavLink to="/garden-house/gallery">{t("Gallery")}</NavLink>
  </nav>;
}
