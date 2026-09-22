import { useLanguage } from '../i18n/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { EXTERNAL_LINKS as X } from '../constants/links';

export function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const gardenHouse = pathname.startsWith('/garden-house');

  if (gardenHouse) return <footer className="footer garden-house-footer">
    <div className="footer-mark"><p>GARDEN HOUSE</p><h2>{t("A secluded stay.")}<br/><em>{t("Coming soon.")}</em></h2><span>{t("Sardegna · Italy")}</span></div>
    <div className="footer-links"><div><small>GARDEN HOUSE</small><Link to="/garden-house">{t("Home")}</Link><Link to="/garden-house/gallery">{t("Gallery")}</Link></div><div><small>{t("SISTER PROPERTY")}</small><Link to="/">Sa Corte Antiga →</Link></div><div><small>{t("STATUS")}</small><span>{t("Coming soon")}</span></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Garden House</span><span>{t("A new Sardinian stay")}</span></div>
  </footer>;

  return <footer className="footer"><div className="footer-mark"><p>SA CORTE ANTIGA</p><h2>{t("Come for the coast.")}<br/><em>{t("Stay for the quiet.")}</em></h2><span>{t("Nebida · Sardegna · Italy")}</span></div><div className="footer-links"><div><small>{t("EXPLORE")}</small><Link to="/">{t("Home")}</Link><Link to="/why-sa-corte-antiga">{t("Why Sa Corte Antiga")}</Link><Link to="/contact">{t("Contact")}</Link></div><div><small>{t("BOOKING")}</small><a href={X.airbnb} target="_blank" rel="noopener noreferrer">Airbnb ↗</a><a href={X.booking} target="_blank" rel="noopener noreferrer">Booking.com ↗</a><a href={X.agoda} target="_blank" rel="noopener noreferrer">Agoda ↗</a></div><div><small>{t("CONTACT")}</small><a className="whatsapp" href={X.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Sa Corte Antiga</span><span>{t("A private stay on the Sardinian coast")}</span></div></footer>;
}
