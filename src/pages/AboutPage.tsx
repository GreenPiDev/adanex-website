import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/about';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../animations/gsap';
import { AboutHero } from '../components/about/AboutHero';
import { AboutSectors } from '../components/about/AboutSectors';
import { ProductLedger } from '../components/about/ProductLedger';
import { useAboutCopy } from '../components/about/useAboutCopy';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { PRODUCT_FAMILIES } from '../content/about';

/**
 * Hakkımızda: girişte slogan, firmanın kısa tanımı ve ürün aileleri; ardından kutudan çıktığı gibi
 * sevk edilen ürün aileleri (ürünlerin sahada bilinen adlarıyla) ve ürünlerin çalıştığı sahalar.
 */
export function AboutPage() {
  const { ledger, rail } = useAboutCopy();
  const sequenceRef = useRef<HTMLDivElement>(null);

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
      <AboutHero />
      <ProductLedger sequenceRef={sequenceRef} />

      <SectionRail
        sequenceRef={sequenceRef}
        items={PRODUCT_FAMILIES.map(({ key }) => ({ key, label: ledger.families[key].short }))}
        label={rail.label}
      />

      <AboutSectors />
    </>
  );
}
