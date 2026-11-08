import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { CONTACT } from '../../content/contact';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ContactForm.module.css';

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  message: z.string().trim().min(10),
  consent: z.boolean().refine(Boolean),
});

type ContactValues = z.infer<typeof contactSchema>;

const DEFAULT_VALUES: ContactValues = { name: '', email: '', message: '', consent: false };

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
  const [isPrepared, setIsPrepared] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: DEFAULT_VALUES });

  // Form servisi seçilene kadar mesaj, kullanıcının e-posta uygulamasında hazırlanır.
  const onSubmit = ({ name, email, message }: ContactValues) => {
    const subject = encodeURIComponent(t('contact.form.mail.subject', { name }));
    const body = encodeURIComponent(t('contact.form.mail.body', { name, email, message }));
    window.location.assign(`mailto:${CONTACT.email}?subject=${subject}&body=${body}`);
    setIsPrepared(true);
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

        <div data-reveal>
          <button className={styles.submit} type="submit">
            <RollText text={t('contact.form.submit').toLocaleUpperCase(i18n.language)} />
            <RollArrow />
          </button>
          <p className={styles.status} role="status">
            {isPrepared ? t('contact.form.prepared') : ''}
          </p>
        </div>
      </form>
    </section>
  );
}
