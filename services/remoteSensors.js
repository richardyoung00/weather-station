import noble from '@abandonware/noble';
import * as deviceProfiles from '../device_profiles/profiles.js'

export class RemoteSensorService {

    constructor(config) {
 
        this.remote_sensors = config.remote_sensors;
    }

    start() {
        console.log('Remote Sensor Service starting')
        this.scanForUnconnectedDevicesAndConnect()

        setInterval(() => {
            this.scanForUnconnectedDevicesAndConnect()
            
        }, 10000)
        
    }

    scanForUnconnectedDevicesAndConnect() {
        const unconnectedDevices = this.remote_sensors.filter(d => !d._connected)
        
        if (unconnectedDevices.length === 0) {
            console.log('All devices connected')
            return
        }

        console.log(`Looking for ${unconnectedDevices.length} devices`)

        
        noble.on('discover', (peripheral) => {
            
            const matchingDevice = unconnectedDevices.find(d => d.mac_address.toLowerCase() === peripheral.address.toLowerCase())
            if (matchingDevice && peripheral.state === 'disconnected' && peripheral.connectable === true) {
                matchingDevice._peripheral = peripheral;
                this.connect(matchingDevice);
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
            console.log(name + ' temperature: ' + temp);
        });
        
        deviceProfilePeripheral.on('humidityNotif', (hum) => {
            console.log(name + ' humidity: ' + hum);
        });

        await deviceProfilePeripheral.connectAndSetUp()
        console.log(name + ' connected!');
        deviceConfig._connected = true;
        await deviceProfilePeripheral.enableTemperatureSensor(10000)
        await deviceProfilePeripheral.enableHumiditySensor(10000)

    }

}