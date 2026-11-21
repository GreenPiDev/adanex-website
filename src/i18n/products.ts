import enProducts from '../locales/en/products.json';
import trProducts from '../locales/tr/products.json';
import i18n from './index';

// Metinler ana pakete girmez, sayfanın kendi parçasıyla birlikte yüklenir.
i18n.addResourceBundle('tr', 'products', trProducts);
i18n.addResourceBundle('en', 'products', enProducts);
