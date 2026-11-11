import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/services';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from '../animations/gsap';
import { DotMorph } from '../components/services/DotMorph';
import { ServicesClosing } from '../components/services/ServicesClosing';
import { ServicesHero } from '../components/services/ServicesHero';
import { ServicesManifesto } from '../components/services/ServicesManifesto';
import { ServiceStation } from '../components/services/ServiceStation';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { SERVICE_STATIONS } from '../content/services';
import { useIsMobile } from '../hooks/useDevice';

/**
 * Hizmetler, satıştan uygulamaya giden tek bir hat olarak anlatılır: aşamalar bir tek hat şemasının
 * duraklarıdır, soldaki bara okundukça dolar ve her aşamanın klemensini yakar.
 */
export function ServicesPage() {
  const { t } = useTranslation('services');
  const sequenceRef = useRef<HTMLDivElement>(null);
  // Telefonda hero'da dalga, Yaklaşım'da tabela yoktur.
  const showDots = !useIsMobile();

  // Büyük başlıklar font inince boy değiştirir, tetikleyici konumları yeniden ölçülür.
  useEffect(() => {
    let isCancelled = false;
    document.fonts.ready.then(
      () => {
        if (!isCancelled) ScrollTrigger.refresh();
      },
      () => undefined,
    );

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {/* Bölüm zeminlerinin üstünde, ondan sonra gelen içeriğin altında çizilsin diye hero'dan önce durur. */}
      {showDots && <DotMorph />}
      <ServicesHero />
      <ServicesManifesto />

      <div ref={sequenceRef}>
        {SERVICE_STATIONS.map((station, index) => (
          <ServiceStation key={station.key} station={station} index={index} />
        ))}
      </div>

      <SectionRail
        sequenceRef={sequenceRef}
        items={SERVICE_STATIONS.map(({ key }) => ({ key, label: t(`stations.${key}.short`) }))}
        label={t('rail.label')}
      />

      <ServicesClosing />
    </>
  );
}
