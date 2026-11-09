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
- Özel imleç yalnızca fare olan cihazlarda çalışıyor (`src/components/ui/CustomCursor/`). Tıklanabilir alanlarda büyüyüp sarıya dönüyor.
- Scrollbar ince ve sarı. Ortak sarı `tokens.css` içinde `--color-amber`, projede `var(--color-amber)` ile kullanılır.
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

### 2026-11-08: Sayfa geçişi

- Sarı perde geçişi eklendi (`src/components/layout/PageTransition/`). Gidilen sayfanın adı Big Shoulders Stencil ile ortada yazıyor, ana sayfaya gidişte yazı yerine logo var, dil değişiminde perde çalışmıyor.
- `useBlocker` ile kuruldu, linkler ve tarayıcının geri/ileri tuşları aynı akıştan geçiyor. React Router tek blocker destekliyor: ileride form için "kaydedilmemiş değişiklik" uyarısı istenirse bu akışa eklenmeli.

### 2026-11-08: İletişim sayfası

- `/contact` yazıldı (`src/pages/ContactPage.tsx`, `src/components/contact/`), rota lazy yükleniyor. İletişim bilgileri firmanın mevcut sitesinden alındı, `src/content/contact.ts` içinde.
- Akış: üç kolonlu (yan yatmış sarı stencil başlık, slogan, alt alta konum ve yerel saat) yapışık ve "kaydır" belirteçli hero, üstüne perde gibi binen sarı "bizi arayın" bölümü, numaralı form, koyu harita üzerinde adres plakası.
- Sayfanın büyük yazılarında okunaklılık için Barlow Semi Condensed kullanılıyor. Big Shoulders Stencil sayfa geçişi perdesinde, hero başlığında ve kısa etiketlerde kullanılıyor.
- `useHeaderSurface`, üst üste binen bölümlerde en üstte görüneni esas alacak şekilde güncellendi.
- **Yayından önce:** Form servisi seçilene kadar gönderim kullanıcının e-posta uygulamasını açıyor. KVKK onay metni firma onayından geçmeli, `/privacy-notice` yazılınca forma bağlantısı eklenmeli. Google Maps gömmesi üçüncü taraf çerezi kullanabilir, çerez politikasına yansıtılmalı.

### 2026-11-08: Sayfa başlıklı hero

- `PageHero` eklendi (`src/components/layout/PageHero/`). Ana sayfa dışındaki sayfalarda solda yan yatmış sayfa adı var, yazı boyutu adın uzunluğuna göre aynı yüksekliğe sığacak şekilde ayarlanıyor. İletişim sayfası da bunu kullanıyor.
- Hakkında, hizmetler, çalışmalar ve teknik bilgi merkezi şimdilik `SectionPage` ile bu hero ve altındaki geçici test bölümlerini gösteriyor.

### 2026-11-08: 404 sayfası

- Bilinmeyen adresler artık ana sayfaya atmak yerine `src/pages/NotFoundPage.tsx` sayfasını gösteriyor. Adres korunuyor, dil URL'den geliyor.
- Vercel her adrese `index.html` ile 200 döndüğü için arama motorlarına `noindex` veriliyor. Gerçek 404 durum kodu prerender kararına bağlı.

### 2026-11-09: Footer

- Her sayfanın altına minimal, tek satırlık koyu footer eklendi (`src/components/layout/Footer/`, `RootLayout` içinde). Solda dile bağlı "Detaylı bilgi için tıklayın", sağda sarı `www.adanex.com.tr` ve ok var. Tüm satır https://www.adanex.com.tr adresine yeni sekmede giden tek bağlantı, dar ekranda iki parça alt alta geçiyor.
- `useHeaderSurface` artık `main` dışındaki footer'ı da izliyor.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.
- Çerezler bağlantısı `/cookie-policy` yazılınca eklenmeli.

### 2026-11-09: Çalışmalarımız sayfası

- `/projects` yazıldı (`src/pages/ProjectsPage.tsx`, `src/components/projects/`), rota lazy yükleniyor. Teknik veriler `src/content/projects.ts`, metinler çeviri dosyalarında.
- Akış: `PageHero` içinde üstte giriş cümlesi, altta iki kısa vurgu taşıyan tipografik bento karoları ile "Kaydır" belirteci, ardından altı tam ekran dosya. Masaüstünde her dosya bir öncekinin üstüne perde gibi biner. Mobilde ve kısa ekranlarda doğal scroll ile sırayla akar. Sayfa sonunda Zone sınıflandırması uyarısı var.
- Dosyalar arasında konum, ilerleme ve atlama için `ProjectsNav` eklendi: masaüstünde sağda dikey ray, mobilde ve dikey tablette altta şerit. Yalnızca dosyalar görünürken çıkar.
- Dosyalardaki görseller tıklanınca tam ekran açılır (`src/components/ui/Lightbox/`).
- "Kaydır" belirteci ortak bileşen oldu (`src/components/ui/ScrollCue/`), iletişim sayfası da bunu kullanıyor.
- **Yayından önce:** Görseller Metinler mevcut siteden kısaltılarak yazıldı, teknik içerik ve İngilizce çeviri firma onayından geçmeli.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

## Sıradaki Teknik İşler

- Diğer gerçek sayfalar (`SectionPage` ve `DemoPage` yerine).
- Kalan sayfalarda rota bazlı code splitting (ana paket yaklaşık 534 kB, gzip 180 kB).
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
