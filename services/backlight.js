import { exec } from 'child_process';

const SCREENSAVER_OFF = `xset -d :0 s off`
const SCREEN_TIMEOUT_OFF = `xset -d :0 dpms 0 0 0`
const SCREEN_ON = `xset -d :0 dpms force on`
const SCREEN_OFF = `xset -d :0 dpms force off`
const GET_BRIGHTNESS = `cat /sys/class/backlight/rpi_backlight/actual_brightness`
const SET_SCREEN_TIMEOUT = (timeout_s) => `xset -d :0 dpms 0 0 ${timeout_s}`
// value between 0 and 255
const SET_SCREEN_BRIGHTNESS = (brightness_value) => `echo ${brightness_value} > /sys/class/backlight/rpi_backlight/brightness`

const MAX_LUX_SQ = 10; // maximum achievalbe lux 
const MIN_LUX_SQ = 1; // min achievable lux

const SCREEN_OFF_LUX_SQ = 2; 
const NIGHT_TIME_SCREEN_TIMOUT_S = 5;

const BRIGHTNESS_FADE_SPEED = 30;

export class BacklightService {
    constructor(config) {
        this.config = config;
        this.nightMode = false;
        this.actualBrightness = 255;
        this.targetBrightness = 255;
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

    async fadeBrightness() {
        setInterval(async () => {
            if (this.actualBrightness > this.targetBrightness) {
                this.actualBrightness--
                await this.exec(SET_SCREEN_BRIGHTNESS(this.actualBrightness))
            } else if (this.actualBrightness < this.targetBrightness) {
                this.actualBrightness++
                await this.exec(SET_SCREEN_BRIGHTNESS(this.actualBrightness))
            }
        }, BRIGHTNESS_FADE_SPEED)
    }

    async start() {
        await this.exec(SCREENSAVER_OFF)
        await this.exec(SCREEN_TIMEOUT_OFF)
        await this.exec(SCREEN_ON)
        this.actualBrightness = parseInt(await this.exec(GET_BRIGHTNESS))
        this.targetBrightness = this.actualBrightness;
        this.fadeBrightness()
    }

    async setAmbientLight(ambient_light, lux)  {
        const lux_sq = Math.sqrt(lux)
        const lux_sq_range = MAX_LUX_SQ - MIN_LUX_SQ
        let val = (lux_sq - MIN_LUX_SQ) / lux_sq_range * 255 
        val = Math.max(10, val)
        val = Math.min(val, 255)
        val = Math.round(val)
        this.targetBrightness = val;

        if ( !this.nightMode && lux_sq <= SCREEN_OFF_LUX_SQ)  {
            this.nightMode = true;
            const c = SET_SCREEN_TIMEOUT(NIGHT_TIME_SCREEN_TIMOUT_S)
            await this.exec(SET_SCREEN_TIMEOUT(NIGHT_TIME_SCREEN_TIMOUT_S))
        } else if (this.nightMode && lux_sq > SCREEN_OFF_LUX_SQ) {
            this.nightMode = false;
            await this.exec(SCREEN_TIMEOUT_OFF)
            await this.exec(SCREEN_ON)
        }
    }
}