import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendEnquiry } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { italian } from '../i18n/translations';

export function Contact() {
  const { t, language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const validate = (field: HTMLInputElement | HTMLTextAreaElement) => {
    field.setCustomValidity('');
    if (field.validity.valueMissing) field.setCustomValidity(t('Please complete this field.'));
    else if (field.validity.typeMismatch && field instanceof HTMLInputElement && field.type === 'email') field.setCustomValidity(t('Please enter a valid email address.'));
    else if (!field.validity.valid) field.setCustomValidity(t('Please enter a valid value.'));
  };
  useEffect(() => {
    formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea').forEach(field => {
      if (field.validity.customError) validate(field);
    });
  }, [language]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    setState('sending');
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      const result = await sendEnquiry(data);
      setMsg(result.message || 'Thank you. Your enquiry has been sent.');
      setState('sent');
      form.reset();
    } catch (error) {
      setMsg(error instanceof Error && error.message in italian ? error.message : 'Unable to send');
      setState('error');
    }
  }
  return <div className="contact-page">
    <section className="contact-intro"><p className="eyebrow">{t('CONTACT')}</p><h1>{t('Plan your')}<br/><em>{t('stay in Sardinia.')}</em></h1><p>{t('Send us your dates or questions and we’ll get back to you.')}</p></section>
    <form ref={formRef} className="contact-form" onSubmit={submit} onInvalid={e => validate(e.target as HTMLInputElement)} onInput={e => {
      const field = e.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('');
    }}>
      <label>{t('Name *')}<input name="name" required autoComplete="name"/></label>
      <label>{t('Email *')}<input name="email" required type="email" autoComplete="email"/></label>
      <label>{t('Phone')} <span>{t('optional')}</span><input name="phone" type="tel" autoComplete="tel"/></label>
      <div className="form-row"><label>{t('Arrival')} <span>{t('optional')}</span><input name="arrivalDate" type="date"/></label><label>{t('Departure')} <span>{t('optional')}</span><input name="departureDate" type="date"/></label></div>
      <label>{t('Message *')}<textarea name="message" required rows={6}/></label>
      <button className="button dark" type="submit" disabled={state === 'sending'} aria-busy={state === 'sending'}>{t(state === 'sending' ? 'Sending…' : 'Send enquiry')}</button>
      {state !== 'idle' && state !== 'sending' && <p role="status" className={`form-status ${state}`}>{t(msg)}</p>}
    </form>
  </div>;
}
