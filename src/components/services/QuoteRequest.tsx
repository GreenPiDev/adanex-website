import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { CONTACT } from '../../content/contact';
import { SERVICE_CONTACT_PARAM, SERVICE_QUOTE_REQUIREMENT_KEYS } from '../../content/services';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './QuoteRequest.module.css';

/**
 * Teklif aşamasının eylemi: teklif için gereken belgeler, formu önceden dolduran bağlantı ve
 * dosyalar için e-posta. Formda dosya alanı olmadığı için belgeler e-postayla istenir.
 */
export function QuoteRequest() {
  const { t, i18n } = useTranslation('services');
  const { pathname } = useLocation();
  const contactPath = `${localizePath('/contact', getLocaleFromPathname(pathname))}?${SERVICE_CONTACT_PARAM}=quotation`;

  return (
    <div className={styles.request} data-station-reveal>
      <h3 className={styles.title}>{t('stations.quotation.request.title').toLocaleUpperCase(i18n.language)}</h3>

      <ul className={styles.list}>
        {SERVICE_QUOTE_REQUIREMENT_KEYS.map((key) => (
          <li key={key} className={styles.item}>
            {t(`stations.quotation.request.items.${key}`)}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Link className={styles.cta} to={contactPath}>
          <RollText text={t('stations.quotation.request.cta').toLocaleUpperCase(i18n.language)} />
          <RollArrow />
        </Link>
        <p className={styles.files}>
          <Trans
            t={t}
            i18nKey="stations.quotation.request.files"
            values={{ email: CONTACT.email }}
            components={{ email: <a className={styles.mail} href={`mailto:${CONTACT.email}`} /> }}
          />
        </p>
      </div>
    </div>
  );
}
