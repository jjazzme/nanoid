import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

import { IncomingMessage, ServerResponse } from 'http';
import { Counter } from './counter.js';
import { env } from './env.js';
import { ResponseProcessor } from './responseProcessor.js';
import { RequestProcessor } from './RequestProcessor.js';
import { Generator } from './generator.js';

const currentModuleFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentModuleFile);

const counter = new Counter(
  path.join(currentDir, 'p', 'counter.html'),
  env.counterWriterInterval,
);
const responseProcessor = new ResponseProcessor(
  path.join(currentDir, 'pages'),
  counter,
);
const generator = new Generator(env.alphabet);

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const request = new RequestProcessor(req);
    responseProcessor.reply(request, res, generator);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(e);
  }
};

const server = http.createServer(requestListener);
server.listen(env.server.port, env.server.host, () => {
  console.log(
    `Server is running on http://${env.server.host}:${env.server.port}`,
  );
});
