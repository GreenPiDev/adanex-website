import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useDevice';
import styles from './ServicesManifesto.module.css';

/**
 * Yaklaşım metni. Bölüm ekrana geldiğinde baştan tam opaklıktadır, bu bölümün hareketi
 * arkadaki nokta tabelasının oluşumudur.
 */
export function ServicesManifesto() {
  const { t } = useTranslation('services');
  // Telefonda hero'da dalga olmadığı için tabela da yoktur (ServicesPage ile aynı koşul).
  const showSign = !useIsMobile();

  return (
    <section className={styles.manifesto} data-surface="light">
      {/* Hero'daki altın noktalar metnin arkasında gri EX tabelasına dönüşür. Noktaları sayfadaki DotMorph çizer. */}
      {showSign && <span className={styles.sign} data-dot-shape="ex" data-dot-tone="steel" aria-hidden="true" />}
      <p className={styles.text}>{t('manifesto.text')}</p>
    </section>
  );
}
