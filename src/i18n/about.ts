import enAbout from '../locales/en/about.json';
import trAbout from '../locales/tr/about.json';
import i18n from './index';

// Metinler ana pakete girmez, sayfanın kendi parçasıyla birlikte yüklenir.
i18n.addResourceBundle('tr', 'about', trAbout);
i18n.addResourceBundle('en', 'about', enAbout);
