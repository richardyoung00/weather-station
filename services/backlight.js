import { exec } from 'child_process';

const SCREENSAVER_OFF = `xset -d :0 s off`
const SCREEN_TIMEOUT_OFF = `xset -d :0 dpms 0 0 0`
const SCREEN_ON = `xset -d :0 dpms force on`
const SCREEN_OFF = `xset -d :0 dpms force off`
const SET_SCREEN_TIMEOUT = (timeout_s) => `xset -d :0 dpms 0 0 ${timeout_s}`
// value between 0 and 255
const SET_SCREEN_BRIGHTNESS = (brightness_value) => `echo ${brightness_value} > /sys/class/backlight/rpi_backlight/brightness`

const MAX_LUX_SQ = 10; // maximum achievalbe lux 
const MIN_LUX_SQ = 2; // min achievable lux

const SCREEN_OFF_LUX_SQ = 2; 
const NIGHT_TIME_SCREEN_TIMOUT_S = 5;

export class BacklightService {
    constructor(config) {
        this.config = config;
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
        await this.exec(SCREENSAVER_OFF)
        await this.exec(SCREEN_TIMEOUT_OFF)
        await this.exec(SCREEN_ON)
    }

    async setAmbientLight(ambient_light, lux)  {
        const lux_sq = Math.sqrt(lux)
        console.log(lux_sq)
        const lux_sq_range = MAX_LUX_SQ - MIN_LUX_SQ
        let val = (lux_sq - MIN_LUX_SQ) / lux_sq_range * 255 
        val = Math.max(10, val)
        val = Math.min(val, 255)
        val = Math.round(val)
        await this.exec(SET_SCREEN_BRIGHTNESS(val))

        if (lux_sq <= SCREEN_OFF_LUX_SQ) {
            console.log('GN')
            //todo: need to keep track of if we already turned off screen, and not run this command again
            // it resets the timer every time we run

            const c = SET_SCREEN_TIMEOUT(NIGHT_TIME_SCREEN_TIMOUT_S)
            console.log(c)
            await this.exec(SET_SCREEN_TIMEOUT(NIGHT_TIME_SCREEN_TIMOUT_S))
        } else {
            console.log('WK')
            await this.exec(SCREEN_TIMEOUT_OFF)
        }
    }
}