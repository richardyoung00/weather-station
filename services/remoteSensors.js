import noble from '@abandonware/noble';
import * as deviceProfiles from '../device_profiles/profiles.js'
import events from 'events';


export class RemoteSensorService extends events.EventEmitter  {

    constructor(config) {
        super();
        this.remote_sensors = config.remote_sensors;
        this.system_settings = config.system_settings;
    }

    start() {
        console.log('Remote Sensor Service starting')
        this.scanForUnconnectedDevicesAndConnect()

        setInterval(() => {
            this.scanForUnconnectedDevicesAndConnect()
            
        }, this.system_settings.ble_scan_interval_ms)
        
    }

    scanForUnconnectedDevicesAndConnect() {
        const unconnectedDevices = this.remote_sensors.filter(d => !d._connected)
        
        if (unconnectedDevices.length === 0) {
            console.log('All devices connected')
            return
        }

        console.log(`Looking for ${unconnectedDevices.length} devices`)

        //todo need to prevent memory leak by added more listeners
        noble.on('discover', (peripheral) => {
            const matchingDevice = unconnectedDevices.find(d => d.mac_address.toLowerCase() === peripheral.address.toLowerCase())
            if (matchingDevice && peripheral.state === 'disconnected' && peripheral.connectable === true) {
                matchingDevice._peripheral = peripheral;
                this.connect(matchingDevice);
            } else if (matchingDevice) {
                console.log("Found device but is not connectable", peripheral.state, peripheral.connectable )
            }
        });

        noble.startScanningAsync();
    }

    async connect(deviceConfig) {
        const name = deviceConfig._peripheral.advertisement.localName 
        console.log('Connecting to ' + name + ' ' + deviceConfig._peripheral.address);
        const DeviceProfile = deviceProfiles[deviceConfig.device_profile];
        const deviceProfilePeripheral = new DeviceProfile(deviceConfig._peripheral);
        
        deviceProfilePeripheral.once('disconnect', () => {
            console.log(name + ' disconnected!');
            deviceConfig._connected = false;
        });
        
        deviceProfilePeripheral.on('temperatureNotif', (temp) => {
            this.emit('sensor_value', {type: 'temperature', value: temp, device: deviceConfig.name});
        });
        
        deviceProfilePeripheral.on('humidityNotif', (hum) => {
            this.emit('sensor_value', {type: 'humidity', value: hum, device: deviceConfig.name});
        });

        await deviceProfilePeripheral.connectAndSetUp()
        console.log(name + ' connected!');
        deviceConfig._connected = true;
        await deviceProfilePeripheral.enableTemperatureSensor(this.system_settings.remote_sensor_update_interval_ms)
        await deviceProfilePeripheral.enableHumiditySensor(this.system_settings.remote_sensor_update_interval_ms)

    }

}