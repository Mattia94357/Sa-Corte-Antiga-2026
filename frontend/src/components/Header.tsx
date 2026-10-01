import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

function GardenHouseMark() {
  return <svg className="garden-house-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 20V8.5M12 12.5C8.9 12.2 6.7 10.5 6 7.4c3.2-.2 5.3 1.4 6 5.1ZM12 16c3.1-.3 5.3-2 6-5.1-3.2-.2-5.3 1.4-6 5.1Z"/>
    <path d="M8.5 20h7"/>
  </svg>;
}

export function Header() {
  const { t } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 12);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const heroVisible = useRef(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const headerControls = useRef<HTMLDivElement>(null);
  const menuPanel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const controls = [...Array.from(headerControls.current?.querySelectorAll<HTMLButtonElement>('button') ?? []), ...Array.from(menuPanel.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const wideScreen = window.matchMedia('(min-width: 1201px)');
    const closeOnDesktop = () => { if (wideScreen.matches) setMenu(false); };
    window.addEventListener('keydown', onKey);
    wideScreen.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      wideScreen.removeEventListener('change', closeOnDesktop);
    };
  }, [menu]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const gardenActive = pathname.startsWith('/garden-house');
  useEffect(() => {
    lastScrollY.current = Math.max(window.scrollY, 0);
    setScrolled(lastScrollY.current > 12);
    setHidden(false);
    const hero = document.querySelector<HTMLElement>('main .hero, main .page-hero, main .garden-house-hero, main .gallery-hero, main .garden-house-gallery-hero');
    heroVisible.current = Boolean(hero && hero.getBoundingClientRect().bottom > 0);
    const heroObserver = hero ? new IntersectionObserver(([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      heroVisible.current = visible;
      lastScrollY.current = Math.max(window.scrollY, 0);
      if (visible) setHidden(false);
    }, { threshold: 0 }) : null;
    if (hero && heroObserver) heroObserver.observe(hero);
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const current = Math.max(window.scrollY, 0);
        const atTop = current <= 12;
        setScrolled(!atTop);
        if (atTop || menu || heroVisible.current) {
          setHidden(false);
          lastScrollY.current = current;
        } else {
          const delta = current - lastScrollY.current;
          if (Math.abs(delta) >= 8) {
            setHidden(delta > 0 && (hero ? true : current > 80));
            lastScrollY.current = current;
          }
        }
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      heroObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menu, pathname]);
  const go = (path: string) => { setMenu(false); navigate(path); };
  return <header className={`site-header ${menu ? 'menu-open' : ''} ${scrolled ? 'header-scrolled' : 'header-at-top'} ${hidden ? 'header-hidden' : ''} ${pathname === '/contact' ? 'header-dark' : ''}`}>
    <Link className="brand" to="/"><span>SA CORTE ANTIGA</span><small>NEBIDA · SARDEGNA</small></Link>
    <nav className="desktop-nav"><NavLink to="/">{t("Home")}</NavLink><NavLink to="/why-sa-corte-antiga">{t("Why Sa Corte Antiga")}</NavLink><NavLink to="/gallery">{t("Gallery")}</NavLink><NavLink to="/contact">{t("Contact")}</NavLink></nav>
    <nav className="property-nav" aria-label={t("Properties")}>
      <Link className={!gardenActive ? 'active' : ''} to="/">Sa Corte Antiga</Link>
      <Link className={`garden-property ${gardenActive ? 'active' : ''}`} to="/garden-house"><span>Garden House</span><GardenHouseMark/></Link>
      <LanguageSwitcher/>
    </nav>
    <nav className="mobile-property-nav" aria-label={t("Properties")}>
      <Link className={!gardenActive ? 'active' : ''} to="/">Sa Corte Antiga</Link>
      <Link className={gardenActive ? 'active' : ''} to="/garden-house">Garden House</Link>
    </nav>
    <div className="mobile-header-controls" ref={headerControls}><LanguageSwitcher/><button ref={toggle} className="menu-toggle" aria-label={menu ? t('Close menu') : t('Open menu')} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}><span/><span/></button></div>
    <AnimatePresence>{menu && <motion.nav ref={menuPanel} id="mobile-navigation" aria-label={t("Main navigation")} className="mobile-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button onClick={() => go('/')}>{t("Home")}</button><button onClick={() => go('/why-sa-corte-antiga')}>{t("Why Sa Corte Antiga")}</button><button onClick={() => go('/gallery')}>{t("Gallery")}</button><button onClick={() => go('/contact')}>{t("Contact")}</button><small>{t("SELECT A STAY")}</small><button className={`mobile-property-link ${!gardenActive ? 'active' : ''}`} onClick={() => go('/')}>Sa Corte Antiga</button><button className={`mobile-property-link garden-property ${gardenActive ? 'active' : ''}`} onClick={() => go('/garden-house')}><span>Garden House</span><GardenHouseMark/></button></motion.nav>}</AnimatePresence>
  </header>;
}
