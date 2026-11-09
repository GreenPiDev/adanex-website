import { useTranslation } from 'react-i18next';
import { CONTACT } from '../../content/contact';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ContactDirectLines.module.css';

/** İletişim hero'sunun sağ kolonu: telefon ve e-posta doğrudan bağlantıları. */
export function ContactDirectLines() {
  const { t, i18n } = useTranslation();

  const lines = [
    { key: 'phone', label: t('contact.direct.phoneLabel'), value: CONTACT.phone.display, href: CONTACT.phone.href },
    { key: 'email', label: t('contact.direct.emailLabel'), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ];

  return (
    <div className={styles.block}>
      <h2 className={styles.title} data-hero-meta>
        {t('contact.direct.title').toLocaleUpperCase(i18n.language)}
      </h2>

      <ul>
        {lines.map(({ key, label, value, href }) => (
          <li key={key} className={styles.item} data-hero-meta>
            <a className={styles.row} href={href}>
              <span className={styles.rowTop}>
                <RollText text={label} />
                <RollArrow />
              </span>
              <RollText className={styles.value} text={value} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
