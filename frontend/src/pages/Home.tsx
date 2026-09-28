import { useLanguage } from '../i18n/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Calendar } from '../components/Calendar';
import { Reveal } from '../components/Reveal';
import { BookingLinks } from '../components/BookingLinks';

export function Home() {
  const { t } = useLanguage();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, .7], [1, .3]);
  const actionsOpacity = useTransform(scrollYProgress, [0, .12, .35], [0, 0, 1]);

  return <>
    <section className="hero" ref={hero}>
      <motion.img className="hero-image" src="/images/HERO sa corte antiga.jpeg" alt={t("Shaded terrace and outdoor table at Sa Corte Antiga")} style={{ scale }}/>
      <div className="hero-shade"/>
      <motion.div className="hero-copy" style={{ y, opacity: fade }}>
        <p>Nebida · Sardegna</p>
        <h1>SA CORTE<br/>ANTIGA</h1>
        <span>{t("A comfortable home near the sea in Nebida, Sardinia.")}</span>
      </motion.div>
      <motion.div className="hero-actions" style={{ opacity: actionsOpacity }}>
        <a className="button light" href="#availability">{t("Check calendar")}</a>
        <Link className="text-link light-link" to="/why-sa-corte-antiga">{t("Why Sa Corte Antiga →")}</Link>
      </motion.div>
      <div className="scroll-cue">{t("SCROLL ")}<i/></div>
    </section>

    <section className="early-booking section" aria-labelledby="early-booking-title">
      <div><p className="eyebrow">{t('BOOK YOUR STAY')}</p><h2 id="early-booking-title">{t('Book Sa Corte Antiga')}</h2><p>{t('Choose your dates and book with one of our trusted partners.')}</p></div>
      <BookingLinks compact/>
    </section>

    <section className="intro section"><Reveal><p className="eyebrow">{t("THE HOUSE · THE COAST · THE QUIET")}</p><h2>{t("A quiet home in Nebida, ")}<em>{t("close to the sea and the cliffs.")}</em></h2></Reveal><div className="intro-note"><span>39°18′ N<br/>8°26′ E</span><p>{t("A comfortable place to return to after a day by the sea.")}</p></div></section>
    <section className="experience"><div className="experience-image"><img src="/images/IMG-20240113-WA0009.jpg" alt={t("Garden gnomes and loungers at Sa Corte Antiga")}/></div><Reveal className="experience-copy"><p className="eyebrow">{t("THE GARDEN")}</p><h2>{t("Relax ")}<em>{t("in the garden.")}</em></h2><p>{t("Have breakfast outside, spend the day by the sea and relax in the garden when you return.")}</p><div className="detail-row"><span>{t("PRIVATE GARDEN")}</span><span>{t("IN NEBIDA")}</span><span>{t("NEAR THE COAST")}</span></div></Reveal></section>
    <section className="house-gallery section">
      <Reveal className="house-gallery-heading">
        <div><p className="eyebrow">{t("THE HOUSE")}</p><h2>{t("See more of")}<br/><em>Sa Corte Antiga.</em></h2></div>
        <div className="house-gallery-intro"><p>{t("See the garden, terrace and rooms inside the house.")}</p><Link className="text-link" to="/gallery">{t("View full gallery →")}</Link></div>
      </Reveal>
      <div className="house-gallery-track">
        <Reveal className="house-gallery-image"><img src="/images/IMG-20240113-WA0008.jpg" alt={t("Shaded terrace and outdoor table at Sa Corte Antiga")}/></Reveal>
      </div>
    </section>
    <section className="availability section" id="availability"><Reveal><div className="section-heading"><div><p className="eyebrow">{t("PLAN YOUR STAY")}</p><h2>{t("Check ")}<em>{t("availability")}</em></h2></div><p>{t("Choose your dates, then book on the platform you prefer.")}</p></div></Reveal><Calendar/><BookingLinks/></section>
    <section className="why-preview"><div className="why-photo"><img src="/images/Bruno Pan di zucchero.jpg" alt={t("Climber overlooking Pan di Zucchero")}/></div><Reveal className="why-copy"><p className="eyebrow">{t("AROUND NEBIDA")}</p><h2>{t("Why")}<br/><em>Sa Corte Antiga</em></h2><p>{t("Explore Nebida, the coast, local beaches, walking trails and climbing routes.")}</p><Link className="text-link" to="/why-sa-corte-antiga">{t("Discover the area →")}</Link></Reveal></section>
  </>;
}
