import Koa from 'koa';
import Router from '@koa/router';
import { RemoteSensorService }  from './services/remoteSensors.js';
import { readConfig } from './config/config.js';
import serve from 'koa-static';

const app = new Koa();
const router = new Router();

function setupWebServer() {
    router.get('/', (ctx, next) => {
        // ctx.router available
      });
    
    app.use(serve('ui'));
    app.use(router.routes());
    app.use(router.allowedMethods());
    
    const PORT = 3000;
    console.log("Server started on port " + PORT)
    app.listen(PORT);
}


async function main() {
    const config = await readConfig();
    const remoteSensorService = new RemoteSensorService(config);
    remoteSensorService.start()
    setupWebServer()
}

main().catch(e => {
    console.error('App Error', e)
})




