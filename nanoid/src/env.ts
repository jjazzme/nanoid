import { TRoutes } from './types';

const digits = '0123456789';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const capital = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const unreadable = '058goqsuvBDIOQS';
const symbols = '_-';

const routes: TRoutes = {
  no: {},
  counter: {
    reg: /^\/c/g,
  },
  help: {
    reg: /^\/h/g,
    processable: true,
    replaces: {
      title: 'HELP: Nano ID generator',
      description:
        'Generation of Nano ID online. Setting generation parameters. UI and TEXT/HEAD mode for automatic requests. Help section',
      icon: 'p/nano.svg',
    },
  },
  sitemap: {
    reg: /^\/sitemap.xml/g,
  },
  robots: {
    reg: /^\/robots.txt/g,
  },
  index: {
    // !! index is last node
    reg: /^\/(?:n[dsulc]*)?(S\d\d?)?[?#]?(?:[?#].+)?$/g,
    processable: true,
    replaces: {
      title: 'NANOID: Nano ID generator',
      description:
        'Generation of Nano ID online. Setting generation parameters. UI and TEXT/HEAD mode for automatic requests',
      icon: 'p/nano.svg',
    },
  },
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
