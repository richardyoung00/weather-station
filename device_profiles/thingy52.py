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