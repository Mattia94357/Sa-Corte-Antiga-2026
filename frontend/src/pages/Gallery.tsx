import { useLanguage } from '../i18n/LanguageContext';
import { Reveal } from '../components/Reveal';

const propertyPhotos = [
  { src: '/images/IMG-20240113-WA0007.jpg', alt: 'Flowering garden and outdoor fireplace at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0008.jpg', alt: 'Shaded terrace and outdoor table at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0009.jpg', alt: 'Sunny garden seating at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0013.jpg', alt: 'Stone and stucco exterior detail at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0003.jpg', alt: 'Dining and living area at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0012.jpg', alt: 'Kitchen at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0004.jpg', alt: 'Double bedroom at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0006.jpg', alt: 'Twin bedroom at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0005.jpg', alt: 'Bathroom detail at Sa Corte Antiga' },
  { src: '/images/IMG-20240113-WA0010.jpg', alt: 'Bathroom at Sa Corte Antiga' },
] as const;

export function Gallery() {
  const { t } = useLanguage();
  return <div className="gallery-page">
    <section className="gallery-hero">
      <div><p>{t("THE HOUSE")}</p><h1>{t("GALLERY")}</h1><span>{t("A closer look at Sa Corte Antiga, inside and out.")}</span></div>
    </section>
    <section className="gallery-collection section" aria-label={t("Sa Corte Antiga property photographs")}>
      <div className="gallery-masonry">
        {propertyPhotos.map((photo) => <Reveal className="gallery-item" key={photo.src}><img src={photo.src} alt={t(photo.alt)} loading="lazy"/></Reveal>)}
      </div>
    </section>
  </div>;
}
