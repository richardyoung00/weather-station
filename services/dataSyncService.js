

export class DataSyncService {
    constructor(websocket) {
        this.websocket = websocket
        this.dirty = false
        this.interval = 5000

        this.data = {
            localSensors: {
        
            },
            remoteSensors: {
                
            }
        }

        setInterval(() => {
            if (this.dirty) {
                this.websocket.emit("data", this.data);
                this.dirty = false
            }
        }, this.interval)
    }

    setLocalSensorValue(key, value) {
        this.data.localSensors[key] = value
        this.dirty = true
    }

    setRemoteSensorValue(device, key, value) {
        if (!this.data.remoteSensors[device]) {
            this.data.remoteSensors[device] = {}
        }
        this.data.remoteSensors[device][key] = value
        this.dirty = true
    }
}