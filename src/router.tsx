import { createBrowserRouter, type RouteObject } from 'react-router';
import { RootLayout } from './components/layout/RootLayout';
import { NAV_ITEMS } from './content/navigation';
import { DemoPage } from './pages/DemoPage';
import { SectionPage } from './pages/SectionPage';

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

// Ana sayfa hero'suzdur, henüz yazılmamış sayfalar başlıklı hero ve test bölümlerini gösterir.
const pageRoutes: RouteObject[] = NAV_ITEMS.map(({ key, path }) => {
  if (path === '/') return { index: true, element: <DemoPage /> };
  if (path === '/contact') return { path: path.slice(1), lazy: loadContactPage };
  if (path === '/projects') return { path: path.slice(1), lazy: loadProjectsPage };
  if (path === '/knowledge-center') return { path: path.slice(1), lazy: loadKnowledgePage };
  if (path === '/services') return { path: path.slice(1), lazy: loadServicesPage };
  return { path: path.slice(1), element: <SectionPage navKey={key} /> };
});

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
