import Koa from 'koa';
import Router from '@koa/router';
import { RemoteSensorService }  from './services/remoteSensors.js';
import { BacklightService }  from './services/backlight.js';
import { LightSensorService }  from './services/local_sensors/lightSensor.js';
import { readConfig } from './config/config.js';
import serve from 'koa-static';

import { createServer } from "http";
import { Server } from "socket.io";



const app = new Koa();
const router = new Router();

const httpServer = createServer(app.callback());
const io = new Server(httpServer);

io.on('connection', socket => { 
    console.log("client connected")
 });

function setupWebServer() {
    router.get('/', (ctx, next) => {
        // ctx.router available
      });
    
    app.use(serve('ui'));
    app.use(router.routes());
    app.use(router.allowedMethods());
    
    const PORT = 3000;
    console.log("Server started on port " + PORT)
    httpServer.listen(PORT);
}


async function main() {
    const config = await readConfig();
    const remoteSensorService = new RemoteSensorService(config);
    remoteSensorService.on('sensor_value', ({value, type, device}) => {
        console.log(value, type, device)
        io.emit("sensor_value", {value, type, device, source: "remote"});
    })
    remoteSensorService.start()

    const backlightService = new BacklightService(config);
    backlightService.start()

    const lightSensorService = new LightSensorService(config);
    lightSensorService.on('sensor_value', (value) => {
        backlightService.setAmbientLight(value.ambient_light, value.lux)
    })
    lightSensorService.start()
    

    
    setupWebServer()
}

main().catch(e => {
    console.error('App Error', e)
})




