import { TRoutes } from './types';

const digits = '0123456789';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const capital = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const unreadable = '058goqsuvBDIOQS';
const symbols = '_-';

const routes: Omit<TRoutes, 'no'> = {
  counter: /^\/c/g,
  help: /^\/h/g,
  sitemap: /^\/sitemap.xml/g,
  robots: /^\/robots.txt/g,
  index: /^\/(?:n[dsulc]*)?(S\d\d?)?[?#]?(?:[?#].+)?$/g, // !! index is last node
};

export const env = {
  alphabet: {
    digits,
    lowercase,
    capital,
    symbols,
    unreadable,
    full: digits + lowercase + capital + symbols,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  textUserAgents: [/^curl/g, /^wget/g, /^axios/g],
  counterRequestInterval: 10000,
  counterWriterInterval: 1000,
  routes,
  defaultOptionsSource: '/nS21',
  rootPathWithOptions: /^\/n[dsulc]*(S\d\d?)?/g,
};
