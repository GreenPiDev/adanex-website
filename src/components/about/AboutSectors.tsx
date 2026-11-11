import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { ABOUT_SECTOR_KEYS } from '../../content/about';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow, RollText } from '../ui/RollText/RollText';
import styles from './AboutSectors.module.css';

/**
 * Kapanış: ürünlerin çalıştığı sahalar eğik çizgiyle ayrılmış tek bir yazı bloğudur (bilgi merkezindeki tesis
 * listesiyle aynı biçim). Altında iletişime çağrı ve Zone uyarısı durur. Ürün önermez, uzman değerlendirmesine yönlendirir.
 */
export function AboutSectors() {
  const { t, i18n } = useTranslation('about');
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  const upper = (text: string) => text.toLocaleUpperCase(i18n.language);

  return (
    <section className={styles.sectors} data-surface="light" data-tone="amber">
      {/* Bölümün başlığı giriş cümlesidir. */}
      <h2 className={styles.lead}>{t('sectors.lead')}</h2>

      <ul className={styles.list} aria-label={t('sectors.listLabel')}>
        {ABOUT_SECTOR_KEYS.map((key) => (
          <li key={key} className={styles.sector}>
            {t(`sectors.items.${key}`)}
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <Link className={styles.cta} to={localizePath('/contact', locale)}>
          <RollText text={upper(t('sectors.cta'))} />
          <RollArrow />
        </Link>
        <p className={styles.note}>{t('sectors.note')}</p>
      </div>
    </section>
  );
}
