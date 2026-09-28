import { useLanguage } from '../i18n/LanguageContext';
import { EXTERNAL_LINKS } from '../constants/links';

const platforms = [
  { id: 'booking', name: 'Booking.com', href: EXTERNAL_LINKS.booking, logo: '/brands/booking-dot-com.svg' },
  { id: 'airbnb', name: 'Airbnb', href: EXTERNAL_LINKS.airbnb, logo: '/brands/airbnb.svg' },
  { id: 'agoda', name: 'Agoda', href: EXTERNAL_LINKS.agoda, logo: '/brands/agoda.svg' },
];

export function BookingLinks({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return <div className="booking-options">
    <div className="booking-links">
      {platforms.map(({ id, name, href, logo }) => <a className={`booking-platform booking-platform-${id}`} key={name} href={href} target="_blank" rel="noopener noreferrer">
        <img className="booking-platform-logo" src={logo} alt="" aria-hidden="true"/>
        <span>{!compact && t("See on ")}{name}</span>
      </a>)}
    </div>
    <div className="booking-direct">
      <p>{t("OR CONTACT US ON WHATSAPP")}</p>
      <a className="booking-whatsapp" href={EXTERNAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"><img src="/brands/whatsapp.svg" alt="" aria-hidden="true"/><span>WhatsApp</span></a>
    </div>
  </div>;
}
