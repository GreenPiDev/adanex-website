import 'i18next';
import type about from '../locales/tr/about.json';
import type common from '../locales/tr/common.json';
import type knowledge from '../locales/tr/knowledge.json';
import type services from '../locales/tr/services.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      about: typeof about;
      common: typeof common;
      knowledge: typeof knowledge;
      services: typeof services;
    };
  }
}
