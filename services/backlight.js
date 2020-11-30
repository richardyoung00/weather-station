import { exec } from 'child_process';

const SCREENSAVER_OFF = `xset -d :0 s off`
const SCREEN_TIMEOUT_OFF = `xset -d :0 dpms 0 0 0`
const SCREEN_ON = `xset -d :0 dpms force on`
const SCREEN_OFF = `xset -d :0 dpms force off`
const SET_SCREEN_TIMEOUT = (timeout_s) => `xset -d :0 dpms 0 0 ${timeout_s}`
// value between 0 and 255
const SET_SCREEN_BRIGHTNESS = (brightness_value) => `echo ${brightness_value} > /sys/class/backlight/rpi_backlight/brightness`

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
}