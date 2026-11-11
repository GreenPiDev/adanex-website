import { createBrowserRouter, type RouteObject } from 'react-router';
import { RootLayout } from './components/layout/RootLayout';
import { NAV_ITEMS } from './content/navigation';
import { DemoPage } from './pages/DemoPage';

async function loadAboutPage() {
  const { AboutPage } = await import('./pages/AboutPage');
  return { Component: AboutPage };
}

async function loadContactPage() {
  const { ContactPage } = await import('./pages/ContactPage');
  return { Component: ContactPage };
}

async function loadProjectsPage() {
  const { ProjectsPage } = await import('./pages/ProjectsPage');
  return { Component: ProjectsPage };
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

type PagePath = Exclude<(typeof NAV_ITEMS)[number]['path'], '/'>;

// Her sayfa kendi parçasıyla yüklenir. Menüye eklenen yeni sayfanın yükleyicisi yoksa tip hatası verir.
const PAGE_LOADERS: Record<PagePath, NonNullable<RouteObject['lazy']>> = {
  '/about': loadAboutPage,
  '/contact': loadContactPage,
  '/projects': loadProjectsPage,
  '/knowledge-center': loadKnowledgePage,
  '/services': loadServicesPage,
};

// Ana sayfa henüz yazılmadığı için geçici test sayfasını gösterir.
const pageRoutes: RouteObject[] = NAV_ITEMS.map(({ path }) =>
  path === '/' ? { index: true, element: <DemoPage /> } : { path: path.slice(1), lazy: PAGE_LOADERS[path] },
);

// Header tek layout'ta durur, dil değişse de yeniden oluşturulmaz.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // Doğrudan lazy bir sayfadan açılışta paket inene kadar html zemini görünür.
    hydrateFallbackElement: <></>,
    children: [
      ...pageRoutes,
      { path: 'en', children: pageRoutes },
      { path: '*', lazy: loadNotFoundPage },
    ],
  },
]);
