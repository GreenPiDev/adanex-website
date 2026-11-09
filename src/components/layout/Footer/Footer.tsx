import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { CONTACT, FOOTER_LINK_OVERRIDES } from '../../../content/contact';
import { stripLocale } from '../../../i18n/locale';
import { RollArrow, RollText } from '../../ui/RollText/RollText';
import styles from './Footer.module.css';

/** Her sayfanın sonundaki tek satırlık bağlantı. */
export function Footer() {
  const { t } = useTranslation();
  const route = stripLocale(useLocation().pathname);

  return (
    <footer className={styles.footer} data-surface="dark">
      <a
        className={styles.link}
        href={FOOTER_LINK_OVERRIDES[route] ?? CONTACT.website.href}
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
