import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { LIGHTING_SECTOR_KEYS, LIGHTING_ZONES, ZONE_TERM } from '../../content/home';
import { getLocaleFromPathname, localizePath } from '../../i18n/locale';
import { RollArrow } from '../ui/RollText/RollText';
import styles from './ZonePlate.module.css';

/**
 * Aydınlatmanın kullanım bölgeleri bir etiket plakası gibi: satırlar gaz ve toz, hücreler Zone'lar.
 * Her hücre teknik bilgi merkezinde o Zone'u anlatan maddeye götürür. Altında kullanıldığı tesisler durur.
 */
export function ZonePlate() {
  const { t, i18n } = useTranslation('home');
  const { pathname } = useLocation();
  const knowledgePath = localizePath('/knowledge-center', getLocaleFromPathname(pathname));

  return (
    <div className={styles.wrapper}>
      <section className={styles.plate} aria-labelledby="lighting-zones-title">
        <h3 id="lighting-zones-title" className={styles.title}>
          {t('zones.title').toLocaleUpperCase(i18n.language)}
        </h3>

        <div className={styles.grid}>
          {LIGHTING_ZONES.map(({ medium, zones }) => (
            <div key={medium} className={styles.row}>
              <p className={styles.medium}>{t(`zones.media.${medium}`)}</p>
              <ul className={styles.cells}>
                {zones.map(({ zone, slug }) => (
                  <li key={zone}>
                    <Link
                      className={styles.cell}
                      to={`${knowledgePath}#${slug}`}
                      aria-label={t('zones.zoneLink', { zone })}
                    >
                      <span className={styles.zoneWord} aria-hidden="true">
                        {ZONE_TERM.toLocaleUpperCase(i18n.language)}
                      </span>
                      <span className={styles.zoneNumber} aria-hidden="true">
                        {zone}
                      </span>
                      <span className={styles.arrow} aria-hidden="true">
                        <RollArrow />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectors}>
        <p className={styles.sectorsLabel}>{t('zones.sectorsLabel')}</p>
        <ul className={styles.sectorList}>
          {LIGHTING_SECTOR_KEYS.map((key) => (
            <li key={key} className={styles.sector}>
              {t(`zones.sectors.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
