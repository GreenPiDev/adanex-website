import { useTranslation } from 'react-i18next';
import { CONTACT } from '../../content/contact';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './ContactDirectLines.module.css';

export function ContactDirectLines() {
  const { t, i18n } = useTranslation();

  const lines = [
    { key: 'phone', label: t('contact.direct.phoneLabel'), value: CONTACT.phone.display, href: CONTACT.phone.href },
    { key: 'email', label: t('contact.direct.emailLabel'), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ];

  return (
    // Header'ın siyah görünmesi için sarı zemin açık yüzey sayılır.
    <section className={styles.section} data-surface="light">
      <h2 className={styles.title} data-reveal>
        {t('contact.direct.title').toLocaleUpperCase(i18n.language)}
      </h2>

      <ul className={styles.list}>
        {lines.map(({ key, label, value, href }) => (
          <li key={key} className={styles.item} data-reveal>
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
    </section>
  );
}
