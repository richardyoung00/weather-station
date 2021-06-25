import Koa from 'koa';
import Router from '@koa/router';
import { RemoteSensorService }  from './services/remoteSensors.js';
import { BacklightService }  from './services/backlight.js';
import { LightSensorService }  from './services/local_sensors/lightSensor.js';
import { TempHumiditySensorService }  from './services/local_sensors/tempHumiditySensor.js';
import { readConfig } from './config/config.js';
import serve from 'koa-static';

import { createServer } from "http";
import { Server } from "socket.io";
import { DataSyncService } from './services/dataSyncService.js';



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
    const dataSyncService = new DataSyncService(io)

    const remoteSensorService = new RemoteSensorService(config);
    remoteSensorService.on('sensor_value', ({value, type, device}) => {
        dataSyncService.setRemoteSensorValue(device, type, value)
    })
    remoteSensorService.start()

    const backlightService = new BacklightService(config);
    backlightService.start()

    const lightSensorService = new LightSensorService(config);
    lightSensorService.on('sensor_value', (value) => {
        backlightService.setAmbientLight(value.ambient_light, value.lux)
        dataSyncService.setLocalSensorValue('ambient_light', value.lux)
    })
    lightSensorService.start()

    const tempHumidityService = new TempHumiditySensorService(config);
    tempHumidityService.on('sensor_value', (value) => {
        dataSyncService.setLocalSensorValue('temperature', value.temperature)
        dataSyncService.setLocalSensorValue('humidity', value.humidity)
    })
    tempHumidityService.start()
    

    
    setupWebServer()
}

main().catch(e => {
    console.error('App Error', e)
})




