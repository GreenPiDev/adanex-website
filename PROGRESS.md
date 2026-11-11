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
- Akış: üç kolonlu (yan yatmış sarı stencil başlık, slogan, "bizi arayın" telefon ve e-posta bağlantıları) yapışık ve "kaydır" belirteçli hero, üstüne perde gibi binen numaralı form, koyu harita üzerinde adres plakası.
- Sayfanın büyük yazılarında okunaklılık için Barlow Semi Condensed kullanılıyor. Big Shoulders Stencil sayfa geçişi perdesinde, hero başlığında ve kısa etiketlerde kullanılıyor.
- `useHeaderSurface`, üst üste binen bölümlerde en üstte görüneni esas alacak şekilde güncellendi.
- **Yayından önce:** Form servisi seçilene kadar gönderim kullanıcının e-posta uygulamasını açıyor. KVKK onay metni firma onayından geçmeli, `/privacy-notice` yazılınca forma bağlantısı eklenmeli. Google Maps gömmesi üçüncü taraf çerezi kullanabilir, çerez politikasına yansıtılmalı.

### 2026-11-08: Sayfa başlıklı hero

- `PageHero` eklendi (`src/components/layout/PageHero/`). Ana sayfa dışındaki sayfalarda solda yan yatmış sayfa adı var, yazı boyutu adın uzunluğuna göre aynı yüksekliğe sığacak şekilde ayarlanıyor. İletişim sayfası da bunu kullanıyor.
- Hakkında, hizmetler, çalışmalar ve teknik bilgi merkezi o tarihte `SectionPage` ile bu hero ve altındaki geçici test bölümlerini gösteriyor.

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
- Akış: `PageHero` içinde sarı vurgu ve giriş cümlesini taşıyan tipografik bento karoları ile "Kaydır" belirteci, ardından altı tam ekran dosya. Masaüstünde her dosya bir öncekinin üstüne perde gibi biner. Mobilde ve kısa ekranlarda doğal scroll ile sırayla akar. Sayfa sonunda Zone sınıflandırması uyarısı var.
- Dosyalar arasında konum, ilerleme ve atlama için `ProjectsNav` eklendi: masaüstünde sağda dikey ray, mobilde ve dikey tablette altta şerit. Yalnızca dosyalar görünürken çıkar.
- Dosyalardaki görseller tıklanınca tam ekran açılır (`src/components/ui/Lightbox/`).
- Bu sayfada footer bağlantısı ürün kategorisine gider (`FOOTER_LINK_OVERRIDES`, `src/content/contact.ts`).
- "Kaydır" belirteci ortak bileşen oldu (`src/components/ui/ScrollCue/`), iletişim sayfası da bunu kullanıyor.
- **Yayından önce:** Görseller Metinler mevcut siteden kısaltılarak yazıldı, teknik içerik ve İngilizce çeviri firma onayından geçmeli.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

### 2026-11-10: Çalışmalar özet metinleri ve seçim rengi

- Altı dosyanın özet metinleri firmanın verdiği metinlerle değiştirildi. Künyede zaten yazan bilgiler (seri, Zone, sertifika, IP, verimlilik, sıcaklık vb.) metinden çıkarıldı. "Garanti eder", "tam uyum" gibi mutlak ifadeler yumuşatıldı.
- 06/06 özetinde "Adanex exproof pano modellerini inceleyin" metin içi bağlantı oldu (yeni sekmede açılır). Özet metni `white-space: pre-line` ile paragraflı gösteriliyor, çeviride bağlantı `<anchor>` etiketiyle işaretli (`<link>` HTML'de içeriksiz etiket olduğu için çalışmaz).
- Sarı zeminli alanlarda metin seçimi beyaz görünür: `--selection-bg` değişkeni (`base.css`), sarı alanlarda beyaza çevrilir.
- **Yayından önce:** "Maksimum güvenlik/koruma", "uluslararası standartlara uygun", "Zone‑1 D tipi" ve 03/06'daki "acil kitli" ifadeleri firmaya doğrulatılmalı.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

### 2026-11-10: Teknik bilgi merkezi

- `/knowledge-center` yazıldı (`src/pages/KnowledgePage.tsx`, `src/components/knowledge/`), rota lazy yükleniyor. Sayfa, baştan sona okunan bir yazı değil aranıp açılan bir başvuru kitabı olarak kurgulandı.
- Hero aynı zamanda dizindir: `PageHero` içinde büyük arama satırı ve altı bölüm satırı var, yazmaya başlayınca satırların yerini sonuçlar alır. Arama büyük harf ve aksan farkını yok sayar. "Kaydır" belirteci ortak bileşenden gelir.
- Akış: Temeller, Zone Sınıfları (gaz/toz ve sıklık eksenli matris), Ürün Çeşitleri, Aydınlatma, Seçim Rehberi (sarı zeminde işaretlenebilir yedi kriterli liste), Sık Sorulan Sorular. Her maddenin numarası, sayfa içi adresi (`#zone-21` gibi) ve gerektiğinde "Bkz." bağlantısı var.
- Sağdaki ray `ProjectsNav` içinden ortak `src/components/ui/SectionRail/` bileşenine taşındı. Çalışmalar sayfası da bunu kullanıyor.
- Metinler `src/locales/{tr,en}/knowledge.json` içinde ve yalnızca bu sayfayla yüklenir. Yapı ve bağlantılar `src/content/knowledge.ts` içinde.
- Görseller `public/tbm-1..4.webp`, yerleri ve ölçüleri `KNOWLEDGE_IMAGES` içinde.
- **Yayından önce:** İngilizce çeviri ve teknik içerik firma onayından geçmeli. Kaynak sayfa yalnızca Zone 1, 2, 21 ve 22'yi anlatıyor, Zone 0 ve 20 eklenecekse firma metni gerekir (`tbm-2` şemasında Zone 0 görünüyor). `tbm-3` görselindeki "Maksimum Güvenlik" ifadesi ve `tbm-4` veri föyündeki değerler firmaya doğrulatılmalı.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

### 2026-11-10: Negatif header

- Header artık `mix-blend-mode: difference` ile altından geçen içeriğin negatifi olarak çiziliyor. Sarı bölümlerde (`data-tone="amber"`) düz siyah, mobil menü açıkken normal çiziliyor.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

### 2026-11-11: Teknik bilgi merkezi düzenlemeleri

- Zone matrisinin eksen etiketleri (Yanıcı gaz/toz ve sıklık) bölüm başlığıyla aynı fontta (Barlow Semi Condensed).
- Aydınlatma bölümünde `tbm-3` ve `tbm-4`, yan sütunlu ekranda (1024 px ve üstü) madde dizininin altında, sütunda kalan alanı dolduracak boyutta ve ortalı duruyor. Yalnızca kendi maddesi okunurken görünüyor (`imageInAside`). Daha dar ekranda metnin yanında kalıyor.
- "Hangi Exproof Armatür Nerede Kullanılır?" tablosu giriş maddesinin arkasına taşındı (4.2), iki görselli madde arasına mesafe girdi. Sonraki madde numaraları birer kaydı.
- Seçim Rehberi'nde yedi kriter işaretlenince alttan perdeyle açılan bir pencere iletişim sayfasına yönlendiriyor (`ChecklistCompleteDialog`). Telefonda altta, geniş ekranda ortada duruyor. Ürün önermiyor, uzman doğrulamasına yönlendiriyor.
- Özel imleç sarı zeminli bölümlerde (`data-tone="amber"`) tıklanabilir alanda sarı yerine siyah halka gösteriyor.
- **Yayından önce:** Pencere metni (iki dil) firma onayından geçmeli.
- Tip kontrolü, lint ve build temiz geçti. Tarayıcıda görsel kontrol yapılmadı.

### 2026-11-11: Hizmetlerimiz sayfası

- `/services` yazıldı (`src/pages/ServicesPage.tsx`, `src/components/services/`), rota lazy yükleniyor. Metinler `src/locales/{tr,en}/services.json` içinde ve yalnızca bu sayfayla yüklenir, yapı `src/content/services.ts` içinde.
- Kurgu: hizmetler satıştan uygulamaya giden tek bir hat, yani bir **tek hat şeması** olarak anlatılıyor. Sıra işin sahadaki akışı: Keşif, Danışmanlık, Teklif, Uygulama.
- Hero: `PageHero` içinde her ekranda sırasıyla "Patlamadan korunma çözümleri: satıştan uygulamaya." cümlesi (dikey tablet, yatay ekran ve masaüstünde yanında `public/services-1.webp`: sola yatık, köşeleri yuvarlak paralelkenar çerçeve, sağda ekranın kenarına kadar uzanıyor, sol tarafı hafifçe kararıyor; telefonda görsel kurulmuyor ve dosya inmiyor), dört aşamaya götüren yan yana dört dikey kart ve "81 il" sayacı. Kartlar cümle ile sayaç arasındaki bütün yüksekliği kaplıyor. Masaüstü ve yatay ekranlarda kartlar yan yana: numara sol üstte, ok sağ üstte, yatay ad altta, ad boyu kart genişliğine göre ayarlanıyor. Dikey telefon ve tablette kolon yatay yazılı dört karta dar olduğu için kartlar tam genişlikte alt alta, her biri tek satır (numara, ad, ok). Yatay telefonda kartlar ile sayaç yan yana. Üzerine gelince kart alttan sarıyla doluyor. Sayacın sağını dolduran ve yukarıda kartların alt kenarını biraz geçen, salınan altın noktalar denizi var: perspektifli, tepeleri parlak, sol ve üst kenarı yumuşakça kayboluyor, sağda ekranın kenarına, aşağıda hero'nun dibine uzanıyor. Ekran dışında ve gizli sekmede duruyor, dikey tablette daha az nokta çiziyor, hareket azaltma tercihinde tek kare. Telefonda kurulmuyor. Sayaç mekanik sayaç gibi dönüyor, açıklaması her ekranda sayının hemen yanında. Basamak kutusu son rakamın genişliğinde, ekran okuyucu tam cümleyi okuyor. Sağ kolonun üst kenarı yan yatmış başlıktaki Z'nin, alt kenarı H'nin hizasında: kolon `PageHero`'nun ölçtüğü harf kenarlarına oturuyor, cümlenin üstü büyük harf tepesinden, 81'in altı taban çizgisinden kırpılıyor (`text-box`, Firefox henüz desteklemiyor, orada birkaç piksel sapar). Hero tam ekran kalıyor, "Kaydır" belirteci başlığın altındaki header yüksekliği kadar boşlukta duruyor.
- Hero'daki dalga ile Yaklaşım'daki tabela aynı noktalardır (`DotMorph`, ekrana sabit tek tuval, hero'dan önce durur; bölüm zeminlerinin üstünde, yazıların ve kartların altında çizilir). Aşağı kaydırınca noktalar soldan sağa sırayla kalkıp yayla süzülür, bölümün sağ üstündeki, metnin arkasında kalan gri "üçgen içinde EX" tabelasına dönüşür, tabelada her nokta kendi fazıyla yerinde hafifçe kıpırdar, geri kaydırınca yeniden dalga olur. Konumlar her karede `data-wave-anchor`, `data-sign-anchor` ve `data-morph-section` yer tutucularından okunur. Telefonda kurulmaz, hareket azaltma tercihinde noktalar uçmadan doğrudan tabela olur.
- Yaklaşım (açık zemin): giriş metni bölüm ekrana geldiğinde baştan tam opaklıkta, vurgusuz düz metin. Başlık yok, nokta tabelası geniş ekranlarda bölümün sağ üstünde, metnin arkasında soluk duruyor.
- Dört aşama (koyu zemin): solda aşamalar boyunca kesintisiz bir bara var, scroll ile sarıyla doluyor. Dolan uç her aşamanın klemensine gelince klemens yanıyor ve başlığa kol çıkıyor. Her aşamada başlık, iki paragraf ve numaralı kapsam satırları (01.1 gibi) var.
- Kapanış (sarı zemin): iletişim sayfasına giden düğme ve Zone sınıflandırması uyarısı.
- Sağdaki ray ortak `SectionRail` bileşeninden geliyor, dört aşamayı gösteriyor.
- `revealWordsOnScroll`, `src/animations/knowledge.ts` içinden ortak `src/animations/reveal.ts` dosyasına taşındı.
- Mevcut sayfadaki üç görsel kullanılmadı. Üçü de yapay zekâ üretimi (biri "Made with AI" filigranlı), biri de doğrulanmamış "Zone 1, Zone 21 Approved" ve "IP69K" ibareleri taşıyor.
- **Yayından önce:** `services-1.webp` görselinin kaynağı ve kullanım hakkı netleşmeli (görünüşe göre yapay zekâ üretimi, üzerinde yalnızca genel Ex sembolü var). Metinler mevcut siteden düzenlenerek yazıldı, iki dil firma onayından geçmeli. "Güvenliği mühendislik hassasiyetiyle garanti eder" ifadesi "ele alıyoruz" olarak yumuşatıldı. "Montaj ve saha uygulaması" aşaması, eski sayfanın giriş metnindeki fabrika dönüşümü, ATEX direktiflerine uygun montaj ve devreye alma bilgilerinden kuruldu. Firmanın bu hizmetleri ayrı bir aşama olarak sunduğu doğrulatılmalı. "81 ilde saha desteği" ifadesi de doğrulatılmalı.
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
