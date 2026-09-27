import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { GardenHouseNav } from '../components/GardenHouseNav';
import { Reveal } from '../components/Reveal';
import { gardenHouseFeatured as images } from '../constants/gardenHouseImages';

export function GardenHouse() {
  const { t } = useLanguage();
  return <div className="garden-house-home">
    <section className="garden-house-hero">
      <img src={images.hero} alt={t("Garden House courtyard and covered veranda in warm sunlight")} loading="eager" fetchPriority="high"/>
      <div className="garden-house-hero-shade"/>
      <GardenHouseNav/>
      <div className="garden-house-hero-copy">
        <p>{t("COMING SOON")}</p>
        <h1>GARDEN<br/>HOUSE</h1>
        <span>{t("A secluded sea-view gem, coming online soon.")}</span>
      </div>
    </section>

    <section className="garden-house-intro section">
      <Reveal className="garden-house-intro-copy"><p className="eyebrow">{t("A FIRST LOOK")}</p><h2>{t("Quietly set apart.")}<br/><em>{t("Open to the sea.")}</em></h2><p>{t("Garden House is taking shape as a private Sardinian stay, with sheltered outdoor spaces and the coast on the horizon.")}</p></Reveal>
      <Reveal className="garden-house-intro-image"><img src={images.terrace} alt={t("Sheltered terrace at Garden House")} loading="lazy"/></Reveal>
    </section>

    <section className="garden-house-outdoors">
      <Reveal className="garden-house-outdoor-image"><img src={images.outdoor} alt={t("Blue sea viewed from the covered veranda at Garden House")} loading="lazy"/></Reveal>
      <Reveal className="garden-house-outdoor-copy"><p className="eyebrow">{t("OUTSIDE")}</p><h2>{t("Space for a slower")}<br/><em>{t("point of view.")}</em></h2><p>{t("Sunlight, shade and sea air shape the atmosphere around the house.")}</p></Reveal>
    </section>

    <section className="garden-house-inside section">
      <Reveal className="garden-house-inside-heading"><p className="eyebrow">{t("INSIDE")}</p><h2>{t("Simple, calm and")}<br/><em>{t("ready for the day.")}</em></h2></Reveal>
      <Reveal className="garden-house-inside-image"><img src={images.dining} alt={t("Dining area at Garden House")} loading="lazy"/></Reveal>
      <div className="garden-house-gallery-cta"><p>{t("A first look at the spaces inside and out.")}</p><Link className="button dark" to="/garden-house/gallery">{t("View gallery")}</Link></div>
    </section>
  </div>;
}
