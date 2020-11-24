from bluepy import btle, thingy52
import binascii

# thingy = thingy52.Thingy52(MAC_ADDRESS)
# thingy.sound.enable()
# thingy.sound.configure(speaker_mode=0x03)  # 0x03 means sample mode, ref FW doc
# thingy.sound.play_speaker_sample(1)
# thingy.disconnect()

remote_sensors = [
    {
        'name': 'atcthing',
        'mac_address': 'D8:33:83:2B:A2:E4',
        'device_profile': 'thingy52',
        'connected': False
    }
]

def str_to_int(s):
    """ Transform hex str into int. """
    i = int(s, 16)
    if i >= 2**7:
        i -= 2**8
    return i 

class NotificationDelegate(btle.DefaultDelegate):
    def handleNotification(self, hnd, data):
        if (hnd == thingy52.e_temperature_handle):
            teptep = binascii.b2a_hex(data)
            print('Notification: Temp received:  {}.{} degCelsius'.format(
                        str_to_int(teptep[:-2]), int(teptep[-2:], 16)))

def connect_to_sensor(mac_address):
    print("connecting to " + mac_address)
    thingy = thingy52.Thingy52(mac_address)
    thingy.setDelegate(NotificationDelegate())
    thingy.environment.enable()
    thingy.environment.configure(temp_int=1000)
    thingy.environment.set_temperature_notification(True)
    thingy.waitForNotifications(timeout=5)
    thingy.waitForNotifications(timeout=5)
    thingy.waitForNotifications(timeout=5)

    print("# Disconnecting...")
    thingy.disconnect()

def search_for_sensor(sensor):
    print("# Looking for devices...")
    scanner = btle.Scanner()
    le_devices = scanner.scan(timeout=3)
    for dev in le_devices:
        # print('\n')
        print("Device {} ({}), RSSI={} dB".format(dev.addr, dev.addrType, dev.rssi))
        if sensor['mac_address'].lower() == dev.addr.lower():
            connect_to_sensor(dev.addr)
  

search_for_sensor(remote_sensors[0])