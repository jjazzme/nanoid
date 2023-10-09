import http from "http";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";
import { nanoid } from 'nanoid'

import {IncomingMessage, ServerResponse} from "http";

const host: string = '0.0.0.0';
const port: number = 3000;

const currentModuleFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentModuleFile);
const index = fs.readFileSync(path.join(currentDir, 'index.html'), 'utf8');
let counter = parseInt(fs.readFileSync(path.join(currentDir, 'p', 'counter.html'), 'utf8'));

const writer = () => {
    setTimeout(()=>{
        try {
            const saved = parseInt(fs.readFileSync(path.join(currentDir, 'p', 'counter.html'), 'utf8'));
            if (counter < saved) counter = saved;
            if (counter !== saved) {
                fs.writeFileSync(path.join(currentDir, 'p', 'counter.html'), counter.toString(), 'utf8')
            }
        } catch (e) {
            console.error(e);
        } finally {
            writer();
        }
    }, 1000);
}
writer();

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
    if (req.method === 'GET') {
        if (['/', '/simple'].includes(req.url ?? '') ) {
            const browser = req.headers['user-agent'];
            const simple = req.url === '/simple' || browser === '' || browser == undefined || browser.toLowerCase().indexOf('curl') === 0 || browser.toLowerCase().indexOf('wget') === 0 || browser.toLowerCase().indexOf('axios') === 0;
            const nanoID = nanoid();
            counter++;
            res.end(simple ? nanoID : index.replace('{nanoID}', nanoID).replace('{counter}', counter.toString()))
        } else {
            res.end();
        }
    } else {
        res.end();
    }
};




const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});