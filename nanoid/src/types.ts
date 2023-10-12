import { env } from './env';

export type TMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATH';

export type TAlphabet = {
  digits: string;
  lowercase: string;
  capital: string;
  unreadable: string;
  symbols: string;
  full: string;
};

export type TEnv = typeof env;

export type TRoute = 'index' | 'help' | 'no' | 'counter' | 'sitemap' | 'robots';

export type TRoutes = Record<TRoute, RegExp>;

export type TResponseType = 'text' | 'html' | 'head' | 'error';

export type TOptions = {
  noDigits: boolean;
  noSymbols: boolean;
  noUnreadable: boolean;
  noLower: boolean;
  noCapital: boolean;
  size: number;
};
