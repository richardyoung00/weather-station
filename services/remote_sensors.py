
from threading import Thread 
from bluepy import btle
import time

class RemoteSensorService:
    """
    A class that will continually loops throu state.remote_devices and ensures they are connected.
    If a device is not connected it will search for devices, if the device is found it will connect
    to it and start a device profile in a new thread to monitor events.
    """
    def __init__(self, state):
        print('starting...')
        for k,v in state.items():
            print(k, v)
        time.sleep(5)
        
        print('done...')

    def __del__(self): 
        print('Destructor called') 

    def start(self):
        while(True):
            # loop through state.remote_devices
            # if any devices are not connected, attempt connect


    def search_for_sensor(self, sensor):
        print("# Looking for devices...")
        scanner = btle.Scanner()
        le_devices = scanner.scan(timeout=3)
        for dev in le_devices:
            # print('\n')
            print("Device {} ({}), RSSI={} dB".format(dev.addr, dev.addrType, dev.rssi))
            if sensor['mac_address'].lower() == dev.addr.lower():
                device_profile_name = sensor['device_profile']
                device_profile = importlib.import_module(device_profile_name)
                device_profile.connect_to_sensor(dev.addr)
  
