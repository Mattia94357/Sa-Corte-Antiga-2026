import { useLanguage } from '../i18n/LanguageContext';
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Calendar } from '../components/Calendar';
import { Reveal } from '../components/Reveal';
import { BookingLinks } from '../components/BookingLinks';
import { optimizedImage } from '../constants/optimizedImage';
import { homeHeroSources, homeHeroFallback } from '../constants/homeImageDelivery';

export function Home() {
  const { t } = useLanguage();
  const hero = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, .7], [1, .3]);
  const actionsOpacity = useTransform(scrollYProgress, [0, .12, .35], [0, 0, 1]);

  return <>
    <section className="hero" ref={hero}>
      <picture>
        {homeHeroSources.map(source => <source key={source.media + source.type} media={source.media} type={source.type} srcSet={source.srcSet} sizes={source.sizes}/>)}
        <motion.img className="hero-image" {...homeHeroFallback} alt={t("Shaded terrace and outdoor table at Sa Corte Antiga")} loading="eager" fetchPriority="high" decoding="async" style={{ scale: reducedMotion ? 1 : scale }}/>
      </picture>
      <div className="hero-shade"/>
      <motion.div className="hero-copy" style={{ y: reducedMotion ? 0 : y, opacity: fade }}>
        <p>Nebida · Sardegna</p>
        <h1>SA CORTE<br/>ANTIGA</h1>
        <span>{t("A peaceful and private stay in the heart of South-West Sardinia.")}</span>
      </motion.div>
      <motion.div className="hero-actions" style={{ opacity: actionsOpacity }}>
        <a className="button light" href="#availability">{t("Check calendar")}</a>
        <Link className="text-link light-link" to="/why-sa-corte-antiga">{t("Why Sa Corte Antiga →")}</Link>
      </motion.div>
      <div className="scroll-cue">{t("SCROLL ")}<i/></div>
    </section>

    <section className="early-booking section" aria-labelledby="early-booking-title">
      <div><p className="eyebrow">{t('BOOK YOUR STAY')}</p><h2 id="early-booking-title">{t('Book your stay')}</h2><p>{t('Check availability and choose the booking platform you prefer.')}</p></div>
      <BookingLinks compact/>
    </section>

    <section className="intro section"><Reveal><p className="eyebrow">{t("THE HOUSE · THE COAST · THE QUIET")}</p><h2>{t("A perfect home ")}<em>{t("to relax and explore")}</em></h2></Reveal><div className="intro-note"><span>39°18′ N<br/>8°26′ E</span><p>{t("A private garden, outdoor spaces and a convenient base for discovering the south-west coast of Sardinia.")}</p></div></section>
    <section className="experience"><div className="experience-image"><img {...optimizedImage('/images/IMG-20240113-WA0009.jpg', '(max-width: 1024px) 100vw, 55vw')} alt={t("Garden gnomes and loungers at Sa Corte Antiga")} loading="lazy" decoding="async"/></div><Reveal className="experience-copy"><p className="eyebrow">{t("THE GARDEN")}</p><h2>{t("Your own space ")}<em>{t("outdoors")}</em></h2><p>{t("A private garden and outdoor areas where you can have breakfast, relax in the shade or enjoy the evening after a day at the beach.")}</p><div className="detail-row"><span>{t("PRIVATE GARDEN")}</span><span>{t("IN NEBIDA")}</span><span>{t("NEAR THE COAST")}</span></div></Reveal></section>
    <section className="house-gallery section">
      <Reveal className="house-gallery-heading">
        <div><p className="eyebrow">{t("THE HOUSE")}</p><h2>{t("Picture yourself at ")}<br/><em>Sa Corte Antiga</em></h2></div>
        <div className="house-gallery-intro"><p>{t("Take a look at the house and outdoor spaces.")}</p><Link className="text-link" to="/gallery">{t("View the full gallery")}</Link></div>
      </Reveal>
      <div className="house-gallery-track">
        <Reveal className="house-gallery-image"><img {...optimizedImage('/images/IMG-20240113-WA0007.jpg', '(max-width: 767px) 80vw, (max-width: 1024px) calc(100vw - 72px), 84vw')} alt={t("Flowering garden and outdoor fireplace at Sa Corte Antiga")} loading="lazy" decoding="async"/></Reveal>
      </div>
    </section>
    <section className="availability section" id="availability"><Reveal><div className="section-heading"><div><p className="eyebrow">{t("PLAN YOUR STAY")}</p><h2>{t("Check ")}<em>{t("availability")}</em></h2></div><p>{t("Choose your dates and number of guests. If the dates are available, continue with the booking platform you prefer.")}</p></div></Reveal><Calendar/><BookingLinks/></section>
    <section className="why-preview"><div className="why-photo"><img {...optimizedImage('/images/Bruno Pan di zucchero.jpg', '(max-width: 1024px) 100vw, 55vw')} alt={t("Climber overlooking Pan di Zucchero")} loading="lazy" decoding="async"/></div><Reveal className="why-copy"><p className="eyebrow">{t("AROUND NEBIDA")}</p><h2>{t("Why")}<br/><em>Sa Corte Antiga</em></h2><p>{t("A quiet base in Nebida, close to the sea and well placed for exploring the coast, walking trails and climbing areas nearby.")}</p><Link className="text-link" to="/why-sa-corte-antiga">{t("Discover the area →")}</Link></Reveal></section>
  </>;
}
