import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getAvailability, type BlockedRange } from '../services/api';

type AvailabilityState = 'loading' | 'ready' | 'error';
type DateSelection = { start: string | null; end: string | null };

const MIN_GUESTS = 1;
const MAX_GUESTS = 6;

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

function Month({ date, booked, state, selection, onSelect }: { date: Date; booked: Set<string>; state: AvailabilityState; selection: DateSelection; onSelect: (date: string) => void }) {
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
        const selectedStart = selection.start === key;
        const selectedEnd = selection.end === key;
        const inRange = Boolean(selection.start && selection.end && key > selection.start && key < selection.end);
        const dateLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(year, month, day));
        return <button
          type="button"
          key={key}
          className={`${busy ? 'booked' : ''} ${past ? 'past' : ''} ${unknown ? 'unknown' : ''} ${selectedStart ? 'selected-start' : ''} ${selectedEnd ? 'selected-end' : ''} ${inRange ? 'selected-range' : ''}`}
          title={t(busy ? 'Booked' : unavailable ? 'Unavailable' : 'Available')}
          aria-label={`${dateLabel} · ${t(busy ? 'Booked' : unavailable ? 'Unavailable' : 'Available')}`}
          aria-pressed={selectedStart || selectedEnd}
          disabled={unavailable}
          onClick={() => onSelect(key)}
        >{day}</button>;
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
  const [selection, setSelection] = useState<DateSelection>({ start: null, end: null });
  const [guests, setGuests] = useState(2);
  const shell = useRef<HTMLDivElement>(null);
  const availabilityRequest = useRef<ReturnType<typeof getAvailability> | null>(null);

  useEffect(() => {
    let active = true;
    let observer: IntersectionObserver | undefined;
    const load = () => {
      observer?.disconnect();
      // Reuse the request if an effect is reattached; unknown dates stay disabled.
      availabilityRequest.current ??= getAvailability();
      availabilityRequest.current
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
    };
    if (availabilityRequest.current || !('IntersectionObserver' in window)) load();
    else if (shell.current) {
      observer = new IntersectionObserver(entries => {
        if (active && entries.some(entry => entry.isIntersecting)) load();
      }, { rootMargin: '800px 0px', threshold: 0 });
      observer.observe(shell.current);
    }
    return () => { active = false; observer?.disconnect(); };
  }, []);

  const status = state === 'loading' ? 'Loading availability…' : state === 'ready' ? 'Available' : 'Availability temporarily unavailable';
  const firstMonth = new Date(start.getFullYear(), start.getMonth() + offset, 1);
  const secondMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + 1, 1);
  const rangeIsAvailable = (rangeStart: string, rangeEnd: string) => {
    for (let current = rangeStart; current < rangeEnd; current = addUtcDay(current)) {
      if (booked.has(current)) return false;
    }
    return true;
  };
  const selectDate = (date: string) => {
    if (state !== 'ready') return;
    if (!selection.start || selection.end || date <= selection.start) {
      setSelection({ start: date, end: null });
      return;
    }
    if (rangeIsAvailable(selection.start, date)) setSelection({ start: selection.start, end: date });
    else setSelection({ start: date, end: null });
  };
  const confirmed = Boolean(selection.start && selection.end && rangeIsAvailable(selection.start, selection.end));

  return <div ref={shell} className={`calendar-shell availability-${state}`} aria-busy={state === 'loading'}>
    <div className="calendar-toolbar"><p aria-live="polite">{t(status)}</p><div><button aria-label={t('Previous month')} onClick={() => setOffset(Math.max(0, offset - 1))} disabled={offset === 0}>←</button><button aria-label={t('Next month')} onClick={() => setOffset(offset + 1)}>→</button></div></div>
    <div className="calendar-grid"><Month date={firstMonth} booked={booked} state={state} selection={selection} onSelect={selectDate}/><Month date={secondMonth} booked={booked} state={state} selection={selection} onSelect={selectDate}/></div>
    <div className="guest-selector">
      <span>{t('GUESTS')}</span>
      <div className="guest-stepper">
        <button type="button" aria-label={t('Decrease guests')} onClick={() => setGuests(value => Math.max(MIN_GUESTS, value - 1))} disabled={guests === MIN_GUESTS}>−</button>
        <output aria-live="polite">{guests}</output>
        <button type="button" aria-label={t('Increase guests')} onClick={() => setGuests(value => Math.min(MAX_GUESTS, value + 1))} disabled={guests === MAX_GUESTS}>+</button>
      </div>
    </div>
    <div className="calendar-state">
      {confirmed ? <div className="availability-confirmation" role="status"><span className="availability-check" aria-hidden="true">✓</span><strong>{t('Available')}</strong><span className="booking-direction" aria-hidden="true">↓</span></div> : <div className="legend"><span><i className={state === 'ready' ? '' : 'unknown'}/>{t(state === 'ready' ? 'Available' : 'Unavailable')}</span><span><i className="unavailable"/>{t('Booked')}</span></div>}
    </div>
  </div>;
}
