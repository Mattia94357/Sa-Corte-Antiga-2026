import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';

export function Why() {
  const { t } = useLanguage();
  return <div className="inner-page">
    <section className="page-hero why-hero"><img src="/images/masua immagine.jpg" alt={t("Sardinian coast")}/><div><p>{t("WHY SA CORTE ANTIGA")}</p><h1>{t("Where land")}<br/><em>{t("meets sea.")}</em></h1></div></section>
    <section className="editorial section"><Reveal><p className="eyebrow">01 · NEBIDA</p><h2>{t("Nebida, between ")}<em>{t("the mountains and the sea.")}</em></h2></Reveal><p>{t("Nebida is a quiet village on Sardinia’s south-west coast, close to beaches, walking paths and wide sea views.")}</p></section>
    <section className="split-feature"><img src="/images/jurgen-scheeff-5hEeE1ATUMM-unsplash.jpg" alt={t("Sardinian coastal grotto")}/><Reveal><p className="eyebrow">{t("02 · SOUTH-WEST SARDINIA")}</p><h2>{t("Beaches, coves ")}<em>{t("and clear water.")}</em></h2><p>{t("Drive along the coast to find small beaches, coves and nearby villages, with sea views along the way.")}</p></Reveal></section>
    <section className="climb-feature"><img src="/images/Bruno Pan di zucchero.jpg" alt={t("Rock climber facing Pan di Zucchero")}/><div><p className="eyebrow">{t("03 · ROCK CLIMBING")}</p><h2>{t("Climbing")}<br/><em>{t("by the sea.")}</em></h2><p>{t("There are climbing routes along the coast, with limestone walls and views over the Mediterranean.")}</p></div></section>
    <section className="hike-feature section"><Reveal><p className="eyebrow">04 · TREKKING</p><h2>{t("Coastal walks")}<br/><em>{t("and inland trails.")}</em></h2><p>{t("Follow the paths around Nebida for sea views and quieter walks through the surrounding landscape.")}</p><Link className="button dark" to="/#availability">{t("Check availability")}</Link></Reveal><img src="/images/saredgna spiaggia pietre.png" alt={t("A Sardinian coastal path and beach")}/></section>
  </div>;
}
