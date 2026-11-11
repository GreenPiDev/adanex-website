import enServices from '../locales/en/services.json';
import trServices from '../locales/tr/services.json';
import i18n from './index';

// Metinler ana pakete girmez, sayfanın kendi parçasıyla birlikte yüklenir.
i18n.addResourceBundle('tr', 'services', trServices);
i18n.addResourceBundle('en', 'services', enServices);
