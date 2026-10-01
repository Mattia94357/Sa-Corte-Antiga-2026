import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { GardenHouseNav } from '../components/GardenHouseNav';
import { Reveal } from '../components/Reveal';
import { gardenHouseFeatured as images } from '../constants/gardenHouseImages';
import { optimizedImage } from '../constants/optimizedImage';

export function GardenHouse() {
  const { t } = useLanguage();
  return <div className="garden-house-home">
    <section className="garden-house-hero">
      <img {...optimizedImage(images.hero, '(max-width: 767px) 700px, 100vw')} alt={t("Garden House courtyard and covered veranda in warm sunlight")} loading="eager" fetchPriority="high"/>
      <div className="garden-house-hero-shade"/>
      <GardenHouseNav/>
      <div className="garden-house-hero-copy">
        <p>{t("COMING SOON")}</p>
        <h1>GARDEN<br/>HOUSE</h1>
        <span>{t("A secluded sea-view stay on the south-west coast of Sardinia.")}</span>
      </div>
    </section>

    <section className="garden-house-intro section">
      <Reveal className="garden-house-intro-copy"><p className="eyebrow">{t("A FIRST LOOK")}</p><h2>{t("A simple, peaceful home ")}<br/><em>{t("with a sea-view terrace.")}</em></h2><p>{t("A private space to relax and enjoy the sea view.")}</p></Reveal>
      <Reveal className="garden-house-intro-image"><img {...optimizedImage(images.terrace, '(max-width: 1024px) 90vw, 50vw')} alt={t("Sheltered terrace at Garden House")} loading="lazy" decoding="async"/></Reveal>
    </section>

    <section className="garden-house-outdoors">
      <Reveal className="garden-house-outdoor-image"><img {...optimizedImage(images.outdoor, '(max-width: 1024px) 90vw, 55vw')} alt={t("Blue sea viewed from the covered veranda at Garden House")} loading="lazy" decoding="async"/></Reveal>
      <Reveal className="garden-house-outdoor-copy"><p className="eyebrow">{t("OUTSIDE")}</p><h2>{t("Enjoy the")}<br/><em>{t("outdoor space.")}</em></h2><p>{t("A covered terrace where you can relax, enjoy the peace and watch the sun set over the sea.")}</p></Reveal>
    </section>

    <section className="garden-house-inside section">
      <Reveal className="garden-house-inside-heading"><p className="eyebrow">{t("INSIDE")}</p><h2>{t("Simple, comfortable")}<br/><em>{t("interiors.")}</em></h2></Reveal>
      <Reveal className="garden-house-inside-image"><img {...optimizedImage(images.dining, '(max-width: 1024px) 90vw, 55vw')} alt={t("Dining area at Garden House")} loading="lazy" decoding="async"/></Reveal>
      <div className="garden-house-gallery-cta"><p>{t("Take a look inside the house and around the outdoor spaces.")}</p><Link className="button dark" to="/garden-house/gallery">{t("View gallery")}</Link></div>
    </section>
  </div>;
}
