// functional response class

import fs from 'fs';
import path from 'path';
import { Counter } from './counter.js';
import { RequestProcessor } from './RequestProcessor.js';
import { ServerResponse } from 'http';
import { Generator } from './generator.js';
import { customAlphabet } from 'nanoid';
import { env } from './env.js';

export class ResponseProcessor {
  routes: {
    index: string;
    help: string;
    no: string;
    sitemap: string;
    robots: string;
  } & Record<string, string>;
  pagesPath: string;
  counter: Counter;

  constructor(pagesPath: string, counter: Counter) {
    this.counter = counter;

    // generate routes
    this.routes = { index: '?', help: '?', no: '?', sitemap: '?', robots: '?' };
    this.pagesPath = pagesPath;
    const pagesFiles = fs.readdirSync(pagesPath);
    const names = pagesFiles.filter((file) =>
      ['.html', '.txt', '.xml'].includes(path.extname(file)),
    );
    for (const fileName of names) {
      const name = fileName.substring(0, fileName.lastIndexOf('.'));
      this.routes[name] = fs.readFileSync(`${pagesPath}/${fileName}`, 'utf8');
      if (name !== 'robots') {
        this.routes[name] = this.routes[name]
          .replaceAll(/\n/g, ' ')
          .replaceAll(/\r/g, ' ')
          .replaceAll(/\s+/g, ' ')
          .trim();
      }

      if (name === 'help') {
        this.routes[name] = this.routes[name]
          .replaceAll('{alphabet}', env.alphabet.full)
          .replaceAll('{digits}', env.alphabet.digits)
          .replaceAll('{lowercase}', env.alphabet.lowercase)
          .replaceAll('{capital}', env.alphabet.capital)
          .replaceAll('{symbols}', env.alphabet.symbols)
          .replaceAll('{unreadable}', env.alphabet.unreadable);
      }
    }
  }

  reply(request: RequestProcessor, res: ServerResponse, generator: Generator) {
    if (request.responseType === 'error' || request.route === 'no') {
      res.statusCode = 302;
      res.setHeader('Location', '/h');
      res.end(this.routes.no);
      return;
    }
    if (request.route === 'counter') {
      res.end(this.counter.value.toString());
      return;
    }
    if (request.route === 'sitemap') {
      res.setHeader('Content-Type', 'text/xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(this.routes.sitemap);
      return;
    }
    if (request.route === 'robots') {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(this.routes.robots);
      return;
    }
    if (request.route === 'index') {
      const alphabet = generator.usedAlphabet(request.options!);
      const nanoid = customAlphabet(alphabet, request.options?.size ?? 21);
      const nanoID = nanoid();

      res.setHeader('nanoid', nanoID);
      res.setHeader('alphabet', alphabet);
      if (request.responseType === 'head') {
        res.end();
      } else if (request.responseType === 'html') {
        const index = this.routes.index
          .replace('{nanoID}', nanoID)
          .replace('{counter}', (this.counter.value + 1).toString())
          .replace(
            '{counterRequestInterval}',
            env.counterRequestInterval.toString(),
          )
          .replace('{nd_checked}', request.options?.noDigits ? 'checked' : '')
          .replace('{ns_checked}', request.options?.noSymbols ? 'checked' : '')
          .replace(
            '{nu_checked}',
            request.options?.noUnreadable ? 'checked' : '',
          )
          .replace('{nl_checked}', request.options?.noLower ? 'checked' : '')
          .replace(
            '{nc_checked}',
            request.options?.noCapital && !request.options.noLower
              ? 'checked'
              : '',
          )
          .replace('{sz_value}', (request.options?.size ?? 21).toString());
        res.end(index);
      } else {
        // text
        res.end(nanoID);
      }
      this.counter.inc();
    } else {
      const help = this.routes.help;
      if (request.responseType === 'html') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(help);
      } else if (request.responseType === 'text') {
        res.end(`
NANOID.DEV HELP:
> curl nanoid.dev [standard nanoid generation. ALPHABET: ${env.alphabet.full}];
> curl nanoid.dev/n{options}{size}

options:
d - no digits
l - no lowercase
c - no capital
s - no symbols [SYMBOLS alphabet: ${env.alphabet.symbols}]
u - no unreadable [UNREADABLE alphabet: ${env.alphabet.unreadable}]

size:
to set the size add 'S' and the length of nanoid
valid size value is from 3 to 99

example:
> curl nanoid.dev/nduS8
will generate a readable nanoid without numbers

methods:
GET - generation with response body 
HEAD - generation without response body. In this case use response headers 'Alphabet' and 'Nanoid'

github:
https://github.com/jjazzme/nanoid

thanks to my mom, dad, wife, daughter and Andrey Sitnik [npm -i nanoid]
jjazz.me, 2023
`);
      } else {
        res.end();
      }
    }
  }
}