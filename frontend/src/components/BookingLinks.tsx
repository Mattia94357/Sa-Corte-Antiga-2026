import { useLanguage } from '../i18n/LanguageContext';
import { EXTERNAL_LINKS } from '../constants/links';

// Distinct accommodation/travel symbols, not imitations of platform logos.
const platforms = [
  { name: 'Booking.com', href: EXTERNAL_LINKS.booking, icon: <><path d="M6 21V3h12v18M3 21h18M10 21v-5h4v5"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1"/></> },
  { name: 'Airbnb', href: EXTERNAL_LINKS.airbnb, icon: <><path d="m3 11 9-8 9 8M5 9v12h14V9"/><path d="M10 21v-7h4v7"/></> },
  { name: 'Agoda', href: EXTERNAL_LINKS.agoda, icon: <><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M8 7v14M16 7v14"/></> },
];

export function BookingLinks({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return <div className="booking-links">
    {platforms.map(({ name, href, icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">
      <svg className="booking-platform-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">{icon}</svg>
      <span>{!compact && t("See on ")}{name}</span>
    </a>)}
  </div>;
}
