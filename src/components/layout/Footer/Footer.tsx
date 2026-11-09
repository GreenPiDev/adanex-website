import { useTranslation } from 'react-i18next';
import { CONTACT } from '../../../content/contact';
import { RollArrow, RollText } from '../../ui/RollText/RollText';
import styles from './Footer.module.css';

/** Her sayfanın sonundaki tek satırlık bağlantı. */
export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} data-surface="dark">
      <a
        className={styles.link}
        href={CONTACT.website.href}
        target="_blank"
        rel="noopener"
        aria-label={t('footer.linkLabel', { site: CONTACT.website.display })}
      >
        <span className={styles.label}>{t('footer.moreInfo')}</span>
        <span className={styles.site}>
          <RollText text={CONTACT.website.display} />
          <RollArrow />
        </span>
      </a>
    </footer>
  );
}
