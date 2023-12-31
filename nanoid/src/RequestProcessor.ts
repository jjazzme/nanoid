import { TMethod, TOptions, TResponseType, TRouteId } from './types.js';
import { IncomingMessage } from 'http';
import { env } from './env.js';

// functional request class
export class RequestProcessor {
  method: TMethod;
  route: TRouteId;
  path: string;
  responseType: TResponseType;
  cookies?: Record<string, string>;
  options?: TOptions;

  constructor(req: IncomingMessage) {
    this.method = req.method as TMethod;
    this.path = req.url ?? '';

    // set response type
    const browser = req.headers['user-agent'] ?? '';
    this.responseType =
      this.method === 'GET'
        ? 'html'
        : this.method === 'HEAD'
        ? 'head'
        : 'error';
    if (this.responseType === 'html') {
      for (const reg of env.textUserAgents) {
        if (browser?.match(reg)) {
          this.responseType = 'text';
          break;
        }
      }
    }

    // set route
    this.route = 'no';
    for (const [name, route] of Object.entries(env.routes)) {
      if (route.reg && this.path.match(route.reg)) {
        this.route = name as TRouteId;
        break;
      }
    }

    if (this.route === 'index' && this.responseType !== 'error') {
      // create cookies object
      const cRow = req.headers.cookie ?? '';
      const cArray = cRow.split(';');
      this.cookies = {};
      for (const cookie of cArray) {
        const [key, value] = cookie.trim().split('=');
        this.cookies[key] = decodeURIComponent(value);
      }

      const cookiePath = `/${
        this.cookies ? this.cookies['options'] ?? '' : ''
      }`;
      const source = this.path.match(env.rootPathWithOptions)
        ? this.path
        : cookiePath.match(env.routes.index.reg!)
        ? cookiePath
        : env.defaultOptionsSource;

      let size = 21;
      const _size = (env.routes.index.reg!.exec(source) ?? [])[1];
      if (_size) {
        size = parseInt(_size.replace('S', ''));
        if (isNaN(size) || size == null) size = 21;
        if (size < 3) size = 3;
        if (size > 99) size = 99;
      }

      this.options = {
        size,
        noCapital: source.indexOf('c') > 0,
        noDigits: source.indexOf('d') > 0,
        noLower: source.indexOf('l') > 0,
        noSymbols: source.indexOf('s') > 0,
        noUnreadable: source.indexOf('u') > 0,
      };
    }
  }
}
