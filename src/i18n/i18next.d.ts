import 'i18next';
import type products from '../locales/tr/products.json';
import type common from '../locales/tr/common.json';
import type home from '../locales/tr/home.json';
import type knowledge from '../locales/tr/knowledge.json';
import type services from '../locales/tr/services.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      products: typeof products;
      common: typeof common;
      home: typeof home;
      knowledge: typeof knowledge;
      services: typeof services;
    };
  }
}
