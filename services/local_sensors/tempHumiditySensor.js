import { exec } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import events from 'events';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class TempHumiditySensorService extends events.EventEmitter {
    constructor(config) {
        super()
        this.system_settings = config.system_settings;
    }

    async exec(cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else if (stderr) {
                    reject(stderr)
                } else {
                    resolve(stdout)
                }
            })
        })
    }

    async start() {
        setInterval(() => {
            this.readSensor().then(value => {
                this.emit('sensor_value', value)
            })
            

        }, this.system_settings.temp_humidity_sensor_update_interval_ms)

    }

    async readSensor() {
        const res = await this.exec(`python ${__dirname}/dht22.py`)
        return JSON.parse(res)
    }

}