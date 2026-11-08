import { useTranslation } from 'react-i18next';
import { CONTACT } from '../../content/contact';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ContactMap.module.css';

const MAP_QUERY = encodeURIComponent(CONTACT.mapQuery);
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export function ContactMap() {
  const { t, i18n } = useTranslation();

  return (
    <section className={styles.section} data-surface="dark">
      {/* Harita görsel olarak kullanılır: özel imleç ve yumuşak scroll iframe içinde çalışmaz. */}
      <div className={styles.map}>
        <iframe
          className={styles.frame}
          src={`https://www.google.com/maps?q=${MAP_QUERY}&hl=${i18n.language}&z=15&output=embed`}
          title={t('contact.location.mapTitle')}
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Ekipman üzerindeki metal etiketten esinlenen adres plakası. */}
      <div className={styles.plate} data-reveal>
        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt className={styles.specLabel}>{t('contact.location.companyLabel')}</dt>
            <dd className={styles.company}>{CONTACT.company}</dd>
          </div>
          <div className={styles.spec}>
            <dt className={styles.specLabel}>{t('contact.location.addressLabel')}</dt>
            <dd className={styles.address}>
              {CONTACT.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
        </dl>

        <a className={styles.directions} href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
          <RollText text={t('contact.location.directions')} />
          <RollArrow />
        </a>
      </div>
    </section>
  );
}
