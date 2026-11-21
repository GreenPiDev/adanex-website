import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import { PRODUCT_FAMILIES } from '../../content/products';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ContactForm.module.css';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(5000),
  consent: z.boolean().refine(Boolean),
  // Bal küpü alanı: gizlidir, yalnızca botlar doldurur.
  company: z.string(),
});

type ContactValues = z.infer<typeof contactSchema>;

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

const DEFAULT_VALUES: ContactValues = { name: '', email: '', message: '', consent: false, company: '' };

type FieldProps = {
  id: string;
  number: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, number, label, error, children }: FieldProps) {
  return (
    <div className={styles.field} data-reveal>
      <label className={styles.label} htmlFor={id}>
        <span className={styles.number}>{number}</span>
        {label}
      </label>
      <div className={styles.control}>
        {children}
        <span className={styles.line} aria-hidden="true" />
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<SendStatus>('idle');
  const [searchParams] = useSearchParams();

  // Ürünler sayfasındaki teklif bağlantısından gelindiyse mesaj o ürün ailesinin teklif cümlesiyle başlar.
  const family = PRODUCT_FAMILIES.find(({ slug }) => slug === searchParams.get('product'));
  const initialMessage = family ? t(`contact.form.prefill.${family.key}`) : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...DEFAULT_VALUES, message: initialMessage },
  });

  // Mesaj, Resend'e ileten Vercel fonksiyonuna (api/contact.ts) gönderilir.
  const onSubmit = async (values: ContactValues) => {
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, language: i18n.language }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      // Gönderimden sonra önceden yazılmış mesaj geri gelmesin.
      reset(DEFAULT_VALUES);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const describe = (id: string, hasError: boolean) => ({
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${id}-error` : undefined,
  });

  return (
    <section className={styles.section} data-surface="light">
      <div className={styles.intro}>
        <h2 className={styles.title} data-reveal>
          {t('contact.form.title').toLocaleUpperCase(i18n.language)}
        </h2>
        <p className={styles.lead} data-reveal>
          {t('contact.form.lead')}
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field
          id="contact-name"
          number="01"
          label={t('contact.form.nameLabel')}
          error={errors.name && t('contact.form.errors.name')}
        >
          <input
            id="contact-name"
            className={styles.input}
            type="text"
            autoComplete="name"
            {...describe('contact-name', Boolean(errors.name))}
            {...register('name')}
          />
        </Field>

        <Field
          id="contact-email"
          number="02"
          label={t('contact.form.emailLabel')}
          error={errors.email && t('contact.form.errors.email')}
        >
          <input
            id="contact-email"
            className={styles.input}
            type="email"
            autoComplete="email"
            {...describe('contact-email', Boolean(errors.email))}
            {...register('email')}
          />
        </Field>

        <Field
          id="contact-message"
          number="03"
          label={t('contact.form.messageLabel')}
          error={errors.message && t('contact.form.errors.message')}
        >
          <textarea
            id="contact-message"
            className={styles.input}
            rows={3}
            data-lenis-prevent
            {...describe('contact-message', Boolean(errors.message))}
            {...register('message')}
          />
        </Field>

        <div data-reveal>
          <label className={styles.consent}>
            <input
              className={styles.checkbox}
              type="checkbox"
              {...describe('contact-consent', Boolean(errors.consent))}
              {...register('consent')}
            />
            <span>{t('contact.form.consent')}</span>
          </label>
          {errors.consent && (
            <p id="contact-consent-error" className={styles.error}>
              {t('contact.form.errors.consent')}
            </p>
          )}
        </div>

        <div className={styles.trap} aria-hidden="true">
          <input type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
        </div>

        <div data-reveal>
          <button className={styles.submit} type="submit" disabled={status === 'sending'}>
            <RollText text={t('contact.form.submit').toLocaleUpperCase(i18n.language)} />
            <RollArrow />
          </button>
          <p className={styles.status} role="status">
            {status === 'idle' ? '' : t(`contact.form.status.${status}`)}
          </p>
        </div>
      </form>
    </section>
  );
}
