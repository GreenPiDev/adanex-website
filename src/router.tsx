import { createBrowserRouter, replace, type RouteObject } from 'react-router';
import { RootLayout } from './components/layout/RootLayout';
import { NAV_ITEMS } from './content/navigation';
import { type Locale, localizePath } from './i18n/locale';
import { HomePage } from './pages/HomePage';

async function loadProductsPage() {
  const { ProductsPage } = await import('./pages/ProductsPage');
  return { Component: ProductsPage };
}

async function loadContactPage() {
  const { ContactPage } = await import('./pages/ContactPage');
  return { Component: ContactPage };
}

async function loadKnowledgePage() {
  const { KnowledgePage } = await import('./pages/KnowledgePage');
  return { Component: KnowledgePage };
}

async function loadServicesPage() {
  const { ServicesPage } = await import('./pages/ServicesPage');
  return { Component: ServicesPage };
}

async function loadNotFoundPage() {
  const { NotFoundPage } = await import('./pages/NotFoundPage');
  return { Component: NotFoundPage };
}

type PagePath = Exclude<(typeof NAV_ITEMS)[number]['path'], '/home'>;

// Her sayfa kendi parçasıyla yüklenir. Menüye eklenen yeni sayfanın yükleyicisi yoksa tip hatası verir.
const PAGE_LOADERS: Record<PagePath, NonNullable<RouteObject['lazy']>> = {
  '/products': loadProductsPage,
  '/contact': loadContactPage,
  '/knowledge-center': loadKnowledgePage,
  '/services': loadServicesPage,
};

// Ana sayfa giriş noktası olduğu için ana paketle gelir, diğer sayfalar kendi parçalarıyla yüklenir.
const pageRoutes: RouteObject[] = NAV_ITEMS.map(({ path }) =>
  path === '/home' ? { path: 'home', element: <HomePage /> } : { path: path.slice(1), lazy: PAGE_LOADERS[path] },
);

// Kök adres ana sayfaya yönlenir: `/` → `/home`, `/en` → `/en/home`. Replace olduğu için perde çalışmaz.
const homeRedirect = (locale: Locale): RouteObject => ({
  index: true,
  loader: () => replace(localizePath('/home', locale)),
});

// Çalışmalarımız sayfası Ürünler'e katıldı, eski adresler oraya yönlenir.
const legacyRedirects = (locale: Locale): RouteObject[] => [
  { path: 'projects', loader: () => replace(localizePath('/products', locale)) },
];

// Header tek layout'ta durur, dil değişse de yeniden oluşturulmaz.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // Doğrudan lazy bir sayfadan açılışta paket inene kadar html zemini görünür.
    hydrateFallbackElement: <></>,
    children: [
      homeRedirect('tr'),
      ...pageRoutes,
      ...legacyRedirects('tr'),
      { path: 'en', children: [homeRedirect('en'), ...pageRoutes, ...legacyRedirects('en')] },
      { path: '*', lazy: loadNotFoundPage },
    ],
  },
]);
