import { useLanguage } from '../i18n/LanguageContext';
import { GardenHouseNav } from '../components/GardenHouseNav';
import { Reveal } from '../components/Reveal';
import { gardenHousePhotos } from '../constants/gardenHouseImages';

export function GardenHouseGallery() {
  const { t } = useLanguage();
  return <div className="garden-house-gallery-page">
    <section className="garden-house-gallery-hero">
      <GardenHouseNav/>
      <div><p>GARDEN HOUSE</p><h1>{t("GALLERY")}</h1><span>{t("A first look at Garden House.")}</span></div>
    </section>
    <section className="gallery-collection section" aria-label={t("Garden House photographs")}>
      <div className="gallery-masonry garden-house-masonry">
        {gardenHousePhotos.map((photo) => <Reveal className="gallery-item" key={photo.src}><img src={photo.src} alt={t(photo.alt)} loading="lazy"/></Reveal>)}
      </div>
    </section>
  </div>;
}
