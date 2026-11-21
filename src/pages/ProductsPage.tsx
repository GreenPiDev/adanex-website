import '@fontsource/barlow-semi-condensed/600.css';
import '../i18n/products';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../animations/gsap';
import { ProductsHero } from '../components/products/ProductsHero';
import { ProductSectors } from '../components/products/ProductSectors';
import { ProductLedger } from '../components/products/ProductLedger';
import { useProductsCopy } from '../components/products/useProductsCopy';
import { SectionRail } from '../components/ui/SectionRail/SectionRail';
import { PRODUCT_FAMILIES } from '../content/products';
import { useSectionJump } from '../hooks/useSectionJump';

/**
 * Ürünler: girişte slogan, firmanın kısa tanımı ve ürün aileleri; ardından kutudan çıktığı gibi
 * sevk edilen ürün aileleri (ürünlerin sahada bilinen adlarıyla) ve ürünlerin çalıştığı sahalar.
 */
export function ProductsPage() {
  const { ledger, rail } = useProductsCopy();
  const sequenceRef = useRef<HTMLDivElement>(null);
  const jump = useSectionJump();

  // Büyük başlıklar font inince boy değiştirir, tetikleyici konumları yeniden ölçülür. Ana sayfadaki bölümlerden
  // ürün ailesinin adresiyle (#cable-glands gibi) gelindiyse konum, ölçüm bittikten sonra o satıra alınır.
  useEffect(() => {
    let isCancelled = false;
    document.fonts.ready.then(
      () => {
        if (isCancelled) return;
        ScrollTrigger.refresh();
        const slug = window.location.hash.slice(1);
        if (slug) jump(slug, { immediate: true });
      },
      () => undefined,
    );

    return () => {
      isCancelled = true;
    };
  }, [jump]);

  return (
    <>
      <ProductsHero />
      <ProductLedger sequenceRef={sequenceRef} />

      <SectionRail
        sequenceRef={sequenceRef}
        items={PRODUCT_FAMILIES.map(({ key }) => ({ key, label: ledger.families[key].short }))}
        label={rail.label}
      />

      <ProductSectors />
    </>
  );
}
