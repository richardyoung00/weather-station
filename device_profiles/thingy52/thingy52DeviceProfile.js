import Thingy from './thingy52.js' 

export class DeviceProfile extends Thingy {
    constructor(peripheral) {
        super(peripheral)
    }

    async connectAndSetUp() {
        return new Promise((resolve, reject) => {
            super.connectAndSetUp((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })     
    }

    async enableTemperatureSensor(timeout = 30000) {
        await new Promise((resolve, reject) => {
            this.temperature_enable((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })    
        
        await new Promise((resolve, reject) => {
            this.temperature_interval_set(timeout, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })    
    }
    
    async enableHumiditySensor(timeout = 30000) {
        await new Promise((resolve, reject) => {
            this.humidity_enable((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })    
        
        await new Promise((resolve, reject) => {
            this.humidity_interval_set(timeout, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })    
    }

    async enableBatteryLevelNotifications() {

        await new Promise((resolve, reject) => {
            this.notifyBatteryLevel((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

        console.log("Battery notifications enabled")
        
        await new Promise((resolve, reject) => {
            this.readBatteryLevel((err, data) => {
                console.log('data', data)
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}