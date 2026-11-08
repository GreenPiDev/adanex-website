# Adanex: Proje Günlüğü

## Durum

Proje kuruldu. Header, layout, çok dil altyapısı, özel imleç ve scrollbar hazır. Gerçek sayfa içerikleri henüz yok.

## Yapılanlar

### 2026-11-08: Proje kurulumu ve header

**Altyapı**

- Vite, React ve TypeScript (`strict`) projesi kuruldu.
- GSAP, Lenis, React Router, i18next, react-i18next ve Geist Variable eklendi.
- Tasarım tokenları `src/styles/tokens.css`, genel stiller `src/styles/base.css` içinde.
- Türkçe kökte, İngilizce `/en` altında olacak şekilde yönlendirme kuruldu. URL'ler İngilizce.
- `npm run i18n:check` iki dilin anahtarlarını karşılaştırıyor ve `build` içinde çalışıyor.

**Header** (`src/components/layout/Header/`)

- Şeffaf, tam genişlikte ve `RootLayout` içinde.
- Solda firma logosu, sağda altı menü bağlantısı ve dil değiştirici var. Logo, zemine göre koyu veya açık zemin dosyasına geçiyor. Web için optimize edilmiş dosyalar `public/` altında (7 KB ve 4 KB).
- Altından geçen `data-surface` bölümüne göre beyaz veya siyah oluyor (`useHeaderSurface`).
- Mobil ve dikey tablette iki çizgili ikon ve tam sayfa menü var. Menü açıkken scroll kilitleniyor, ESC ve sayfa değişimi menüyü kapatıyor.
- Yatay tablet ve masaüstünde tam menü gösteriliyor.

**Diğer**

- Cihaz hook'ları `src/hooks/useDevice.ts` içinde.
- Özel imleç yalnızca fare olan cihazlarda çalışıyor (`src/components/ui/CustomCursor/`).
- Scrollbar ince ve kehribar renkli.
- `src/pages/DemoPage.tsx` geçici test sayfası: koyu ve açık iki bölüm içeriyor, tüm yollar burayı gösteriyor.

**Doğrulama**

- Tip kontrolü, lint, çeviri kontrolü ve build temiz geçti.
- Header rengi, menü davranışı ve dil geçişi geçici bir sanal DOM testiyle doğrulandı.
- Fontun 12 Türkçe harfin tamamını içerdiği font dosyasından doğrulandı.
- Tarayıcıda görsel kontrol yapılmadı, git işlemi yapılmadı.

### 2026-11-08: Yayın ve yerel ağ erişimi

- Vercel'de GREEN-PI takımına production deploy alındı: https://adanex-website.vercel.app
- `vercel.json` ile tüm yollar `index.html`'e yönlendirildi, sayfa yenilemede 404 alınmıyor.
- `vite.config.ts` içinde `server.host` açıldı, geliştirme sunucusu aynı ağdaki telefondan IP ile açılabiliyor.
- Geliştirme ortamının ağı `*.vercel.app` bağlantılarını kesiyor, canlı adres oradan HTTP ile doğrulanamadı.

## Sıradaki Teknik İşler

- `DemoPage` yerine gerçek sayfaları yazmak.
- Rota bazlı code splitting: tek JS paketi şu an yaklaşık 519 kB (gzip 174 kB).
- Dil ve sayfa bazlı meta açıklamaları, `canonical` ve `hreflang`.
- Kurumsal renkler netleşince tokenları güncellemek.

## Açık Kararlar

- [ ] Kurumsal renkler, ürün kataloğu, sertifika belgeleri, referans listesi
- [ ] SEO ve render: saf SPA mı, build sırasında prerender mı? (Öneri: `vite-react-ssg` veya eşdeğeri ile prerender)
- [ ] İçerik yönetimi: çeviri dosyaları ve tipli veriyle devam mı, headless CMS mi?
- [ ] Teklif/iletişim formunun gönderileceği servis (kendi API, Formspree, Resend vb.)
- [ ] Görsel kaynakları: profesyonel ürün fotoğrafı, video veya 3D model var mı?
- [ ] Yayın ortamı (Vercel, Netlify, kendi sunucu)

## Planlanan Site Yapısı

Aşağıdakiler Türkçe içeriğin yollarıdır, İngilizce içerik aynı yollarla `/en` altında yayınlanır.

- `/` Ana sayfa: Hero → Firma özeti → Ürün grupları → ATEX'e kısa giriş ve Zone anlatımı → Kanıt ve rakamlar → Çalışma süreci → Sektörler → Referanslar → Teklif formu
- `/products`, `/products/:category`, `/products/:category/:slug`
- `/knowledge-center`: ATEX nedir, Zone seçimi, Ex etiketi nasıl okunur
- `/services`, `/projects`
- `/industries`: Petrol ve gaz, kimya, boya, madencilik, gıda ve tahıl, ilaç (firmanın gerçek sektörlerine göre netleşir)
- `/about`, `/references`, `/contact`
- `/privacy-notice` (KVKK aydınlatma metni), `/cookie-policy`

Ürün detayında bulunacak veriler: Ex işaretlemesi, uygun Zone'lar, gaz/toz grubu, sıcaklık sınıfı, IP sınıfı, sertifika no, onaylanmış kuruluş, teknik föy ve sertifika PDF'leri, teklif iste butonu.

## Tasarım Notları

- **Konsept:** Endüstriyel hassasiyet ve güvenlik. Teknik çizim, etiket ve mühendislik belgesi estetiği.
- **Renk (geçici öneri):** Karbon siyah ve antrasit zemin, kırık beyaz metin, Ex uyarı işaretinden gelen tek sinyal rengi (kehribar).

### İmza Fikirler (öneri)

- **Ex etiketi çözümleyici:** Gerçek bir işaretleme (`II 2G Ex db IIC T6 Gb`) scroll ile parça parça açılır, her parçanın anlamı anlatılır. Mobil kurgusu baştan tasarlanır.
- **Zone haritası:** Tesis kesiti üzerinde Zone 0/1/2 ve 20/21/22 alanları scroll ile belirir, tıklanınca uygun ürünler listelenir. Mobil kurgusu baştan tasarlanır.
- **Preloader:** Sektöre özel durum metinleri, gerçek yükleme ilerlemesi, oturum başına bir kez, en fazla yaklaşık 2 saniye.

## sstr.tech Analizi

Kaynak koduna bakılarak çıkarıldı.

- **Yapı:** Astro, GSAP (ScrollTrigger, SplitText, CustomEase, ScrollToPlugin), Lenis, Barba. WebGL efekti yok.
- **Görsel dil:** Tek grotesk font ailesi ve mono yardımcı font, koyu antrasit ve açık gri yüzeyler, tek güçlü vurgu rengi, bölüm bazlı açık/koyu tema, tekrar eden dekoratif SVG şekiller.
- **Token mimarisi:** primitive → alias → mapped (rol) → type → layout katmanları, `em` tabanlı akışkan ölçek.
- **Hareket:** Süreler çoğunlukla 0.3–1.2 sn, yavaş biten özel easing eğrileri.
- **Etkileşimler:** Yüzdeli preloader, başlıklarda SplitText reveal, scroll ile dolan metin, marker vurgusu, sayı odometresi, global parallax, kart ve buton hover'ları, görsel slider, scroll'a göre nav teması, footer parallax, sayfa geçişleri, grafik lazy yükleme.
- **İçerik kurgusu:** Kanıta dayalı B2B dili. Gerçek saha verisi ve vaka çalışmaları önde.

## ATEX Başvuru Tablosu

| Kavram | Değerler |
|---|---|
| Direktifler | 2014/34/AB (ekipman), 1999/92/AT (işyeri) |
| Gaz bölgeleri | Zone 0, 1, 2 |
| Toz bölgeleri | Zone 20, 21, 22 |
| Ekipman grupları | I (madencilik), II (gaz), III (toz; EPL ve Ex işaretlemesinde) |
| ATEX kategorisi | 1 → Zone 0/20, 2 → Zone 1/21, 3 → Zone 2/22 (G: gaz, D: toz) |
| EPL | Ga, Gb, Gc, Da, Db, Dc, Ma, Mb |
| Koruma tipleri | Ex d, e, i, m, p, o, q, n (gaz), Ex t (toz) |
| Gaz grupları | IIA, IIB, IIC |
| Toz grupları | IIIA, IIIB, IIIC |
| Sıcaklık sınıfları | T1 450°C, T2 300°C, T3 200°C, T4 135°C, T5 100°C, T6 85°C |
| Standartlar | EN IEC 60079 serisi, ayrıca uluslararası IECEx şeması |
