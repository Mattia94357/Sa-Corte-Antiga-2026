import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { optimizedImage } from '../constants/optimizedImage';

export function Why() {
  const { t } = useLanguage();
  return <div className="inner-page">
    <section className="page-hero why-hero"><img {...optimizedImage('/images/masua immagine.jpg', '(max-width: 767px) 800px, 100vw')} alt={t("Sardinian coast")} loading="eager" fetchPriority="high"/><div><p>{t("WHY SA CORTE ANTIGA")}</p><h1>{t("Close to the sea")}<br/><em>{t("and Mediterranean nature.")}</em></h1></div></section>
    <section className="editorial section"><Reveal><p className="eyebrow">{t("01 · NEBIDA")}</p><h2>{t("Nebida, between ")}<em>{t("the mountains and the sea.")}</em></h2></Reveal><p>{t("A quiet village on Sardinia’s south-west coast, close to beaches, coastal walks and some of the most beautiful views in the area.")}</p></section>
    <section className="split-feature"><img {...optimizedImage('/images/jurgen-scheeff-5hEeE1ATUMM-unsplash.jpg', '(max-width: 1024px) 100vw, 55vw')} alt={t("Sardinian coastal grotto")} loading="lazy" decoding="async"/><Reveal><p className="eyebrow">{t("02 · SOUTH-WEST SARDINIA")}</p><h2>{t("Beaches, coves ")}<em>{t("and clear water.")}</em></h2><p>{t("Follow the coast to discover hidden beaches, quiet coves and explore the villages of the Iglesiente area.")}</p></Reveal></section>
    <section className="climb-feature"><img {...optimizedImage('/images/Bruno Pan di zucchero.jpg', '(max-width: 1024px) 100vw, 55vw')} alt={t("Rock climber facing Pan di Zucchero")} loading="lazy" decoding="async"/><div><p className="eyebrow">{t("03 · ROCK CLIMBING")}</p><h2>{t("Climbing")}<br/><em>{t("by the sea.")}</em></h2><p>{t("The coast around Nebida offers limestone climbing with routes overlooking the Mediterranean.")}<br/><br/>{t("Ask us which routes are best suited to you and we’ll be happy to guide you.")}</p></div></section>
    <section className="hike-feature section"><Reveal><p className="eyebrow">{t("04 · TREKKING")}</p><h2>{t("Coastal walks")}<br/><em>{t("and inland trails.")}</em></h2><p>{t("Explore the paths around Nebida, from coastal walks with sea views to quieter trails through the hills and Mediterranean landscape.")}</p><Link className="button dark" to="/#availability">{t("Check availability")}</Link></Reveal><img {...optimizedImage('/images/saredgna spiaggia pietre.png', '(max-width: 1024px) 90vw, 40vw')} alt={t("A Sardinian coastal path and beach")} loading="lazy" decoding="async"/></section>
  </div>;
}
