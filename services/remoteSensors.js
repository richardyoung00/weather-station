import noble from '@abandonware/noble';
import * as deviceProfiles from '../device_profiles/profiles.js'

export class RemoteSensorService {

    constructor(config) {
 
        this.remote_sensors = config.remote_sensors;
    }

    start() {
        console.log('Remote Sensor Service starting')
        noble.startScanningAsync();
        noble.on('discover', (peripheral) => {
            const matchingDevice = this.remote_sensors.find(d => d.mac_address.toLowerCase() === peripheral.address.toLowerCase())
            if (matchingDevice) {
                matchingDevice._peripheral = peripheral;
                // noble.stopScanning();
                this.connect(matchingDevice);
            }
        });
    }

    connect(deviceConfig) {
        const name = deviceConfig._peripheral.advertisement.localName 
        console.log('Connecting to ' + name + ' ' + deviceConfig._peripheral.address);
        const DeviceProfile = deviceProfiles[deviceConfig.device_profile];
        const deviceProfilePeripheral = new DeviceProfile(deviceConfig._peripheral);
        deviceProfilePeripheral.connect()

        deviceProfilePeripheral.on('disconnect', () => {
            console.log(name + ' disconnected!');
        });
        
        deviceProfilePeripheral.on('disconnect', () => {
            console.log(name + ' disconnected!');
        });
    }

}