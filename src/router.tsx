import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { RootLayout } from './components/layout/RootLayout';
import { NAV_ITEMS } from './content/navigation';
import { DemoPage } from './pages/DemoPage';

// Gerçek sayfalar yazılana kadar tüm yollar test sayfasını gösterir.
const pageRoutes: RouteObject[] = NAV_ITEMS.map(({ path }) =>
  path === '/' ? { index: true, element: <DemoPage /> } : { path: path.slice(1), element: <DemoPage /> },
);

// Header tek layout'ta durur, dil değişse de yeniden oluşturulmaz.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      ...pageRoutes,
      { path: 'en', children: pageRoutes },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
