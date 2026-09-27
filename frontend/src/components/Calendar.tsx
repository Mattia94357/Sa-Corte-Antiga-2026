import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getAvailability, type BlockedRange } from '../services/api';

type AvailabilityState = 'loading' | 'ready' | 'error';

const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function addUtcDay(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year!, month! - 1, day! + 1)).toISOString().slice(0, 10);
}

function expandRanges(ranges: BlockedRange[]) {
  const dates = new Set<string>();
  for (const range of ranges) {
    for (let current = range.start; current <= range.end; current = addUtcDay(current)) dates.add(current);
  }
  return dates;
}

function Month({ date, booked, state }: { date: Date; booked: Set<string>; state: AvailabilityState }) {
  const { t, locale } = useLanguage();
  const week = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + index)));
  const year = date.getFullYear(), month = date.getMonth();
  const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();

  return <div className="month">
    <h3>{new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)} <span>{year}</span></h3>
    <div className="week">{week.map((day, index) => <span key={index}>{day}</span>)}</div>
    <div className="days">
      {Array.from({ length: leadingDays }, (_, index) => <span key={`x${index}`}/>)}
      {Array.from({ length: days }, (_, index) => {
        const day = index + 1;
        const key = iso(new Date(year, month, day));
        const past = new Date(year, month, day + 1) < new Date();
        const busy = state === 'ready' && booked.has(key);
        const unknown = state !== 'ready' && !past;
        const unavailable = past || busy || unknown;
        return <span key={key} className={`${busy ? 'booked' : ''} ${past ? 'past' : ''} ${unknown ? 'unknown' : ''}`} title={t(busy ? 'Booked' : unavailable ? 'Unavailable' : 'Available')} aria-disabled={unavailable}>{day}</span>;
      })}
    </div>
  </div>;
}

export function Calendar() {
  const { t } = useLanguage();
  const start = useMemo(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }, []);
  const [offset, setOffset] = useState(0);
  const [booked, setBooked] = useState(new Set<string>());
  const [state, setState] = useState<AvailabilityState>('loading');

  useEffect(() => {
    let active = true;
    getAvailability()
      .then(data => {
        if (!active) return;
        setBooked(expandRanges(data.blockedRanges));
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setBooked(new Set());
        setState('error');
      });
    return () => { active = false; };
  }, []);

  const status = state === 'loading' ? 'Loading availability…' : state === 'ready' ? 'Availability updated from Airbnb' : 'Availability temporarily unavailable';
  const firstMonth = new Date(start.getFullYear(), start.getMonth() + offset, 1);
  const secondMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + 1, 1);

  return <div className={`calendar-shell availability-${state}`} aria-busy={state === 'loading'}>
    <div className="calendar-toolbar"><p aria-live="polite">{t(status)}</p><div><button aria-label={t('Previous month')} onClick={() => setOffset(Math.max(0, offset - 1))} disabled={offset === 0}>←</button><button aria-label={t('Next month')} onClick={() => setOffset(offset + 1)}>→</button></div></div>
    <div className="calendar-grid"><Month date={firstMonth} booked={booked} state={state}/><Month date={secondMonth} booked={booked} state={state}/></div>
    <div className="legend"><span><i className={state === 'ready' ? '' : 'unknown'}/>{t(state === 'ready' ? 'Available' : 'Unavailable')}</span><span><i className="unavailable"/>{t('Booked')}</span></div>
  </div>;
}
