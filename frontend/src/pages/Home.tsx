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
      <motion.img className="hero-image" src="/images/masua immagine.jpg" alt={t("The Mediterranean coastline near Nebida")} style={{ scale }}/>
      <div className="hero-shade"/>
      <motion.div className="hero-copy" style={{ y, opacity: fade }}>
        <p>Nebida · Sardegna</p>
        <h1>SA CORTE<br/>ANTIGA</h1>
        <span>{t("A refined Mediterranean stay overlooking the Sardinian coast.")}</span>
      </motion.div>
      <motion.div className="hero-actions" style={{ opacity: actionsOpacity }}>
        <a className="button light" href="#availability">{t("Check calendar")}</a>
        <Link className="text-link light-link" to="/why-sa-corte-antiga">{t("Why Sa Corte Antiga →")}</Link>
      </motion.div>
      <div className="scroll-cue">{t("SCROLL ")}<i/></div>
    </section>

    <section className="early-booking section" aria-labelledby="early-booking-title">
      <div><p className="eyebrow">{t('BOOK YOUR STAY')}</p><h2 id="early-booking-title">{t('Book Sa Corte Antiga')}</h2><p>{t('Check availability and complete your reservation with one of our trusted booking partners.')}</p></div>
      <BookingLinks compact/>
    </section>

    <section className="intro section"><Reveal><p className="eyebrow">{t("THE HOUSE · THE COAST · THE QUIET")}</p><h2>{t("A quiet Sardinian retreat ")}<em>{t("between the cliffs, the sea and the village of Nebida.")}</em></h2></Reveal><div className="intro-note"><span>39°18′ N<br/>8°26′ E</span><p>{t("A private base for slow mornings, salt-air afternoons and evenings under an open sky.")}</p></div></section>
    <section className="experience"><div className="experience-image"><img src="/images/IMG-20240113-WA0007.jpg" alt={t("The garden at Sa Corte Antiga")}/></div><Reveal className="experience-copy"><p className="eyebrow">{t("A SENSE OF PLACE")}</p><h2>{t("Made for days lived ")}<em>{t("outdoors.")}</em></h2><p>{t("Step into a home shaped by the rhythm of the island: breakfast in the shade, a day beside the sea, and the garden waiting when you return.")}</p><div className="detail-row"><span>{t("GARDEN LIVING")}</span><span>{t("VILLAGE SETTING")}</span><span>{t("COASTAL ESCAPE")}</span></div></Reveal></section>
    <section className="house-gallery section">
      <Reveal className="house-gallery-heading">
        <div><p className="eyebrow">{t("THE HOUSE")}</p><h2>{t("A closer look at")}<br/><em>Sa Corte Antiga.</em></h2></div>
        <div className="house-gallery-intro"><p>{t("Spaces shaped for slow mornings, long afternoons and evenings outside.")}</p><Link className="text-link" to="/gallery">{t("View full gallery →")}</Link></div>
      </Reveal>
      <div className="house-gallery-track">
        <Reveal className="house-gallery-image"><img src="/images/IMG-20240113-WA0008.jpg" alt={t("Shaded terrace and outdoor table at Sa Corte Antiga")}/></Reveal>
        <Reveal className="house-gallery-image"><img src="/images/IMG-20240113-WA0009.jpg" alt={t("Sunny garden seating at Sa Corte Antiga")}/></Reveal>
        <Reveal className="house-gallery-image"><img src="/images/IMG-20240113-WA0013.jpg" alt={t("Stone and stucco detail at Sa Corte Antiga")}/></Reveal>
        <Reveal className="house-gallery-image"><img src="/images/IMG-20240113-WA0003.jpg" alt={t("Dining area inside Sa Corte Antiga")}/></Reveal>
      </div>
    </section>
    <section className="availability section" id="availability"><Reveal><div className="section-heading"><div><p className="eyebrow">{t("PLAN YOUR STAY")}</p><h2>{t("Check ")}<em>{t("availability")}</em></h2></div><p>{t("Choose your dates, then continue with the booking platform you prefer.")}</p></div></Reveal><Calendar/><BookingLinks/></section>
    <section className="why-preview"><div className="why-photo"><img src="/images/Bruno Pan di zucchero.jpg" alt={t("Climber overlooking Pan di Zucchero")}/></div><Reveal className="why-copy"><p className="eyebrow">{t("BEYOND THE DOOR")}</p><h2>{t("Why")}<br/><em>Sa Corte Antiga</em></h2><p>{t("For the raw coastline. For Nebida at dusk. For limestone, trails and long swims in clear water.")}</p><Link className="text-link" to="/why-sa-corte-antiga">{t("Discover the area →")}</Link></Reveal></section>
  </>;
}
