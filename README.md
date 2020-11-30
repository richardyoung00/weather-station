# weather-station


## Main station

Hardware

- Rapberry Pi
- 7" Touchscreen
- Ambient light sensor
- Temperature/humidity sensor (DHT22)


# Setup

## Make python 3 default
```
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 10
```

## Install dependencies
```
pip install -r requirements.txt
```

## Allow bluepy to run without root. Your path may be different.
```
sudo setcap cap_net_raw+e  ~/.local/lib/python3.7/site-packages/bluepy/bluepy-helper
sudo setcap cap_net_admin+eip  ~/.local/lib/python3.7/site-packages/bluepy/bluepy-helper
```

Allow noble to have run without root 
```
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

# Tips

## Setting up onscreen keyboard
https://github.com/tobykurien/rpi_tablet_os

## Rotating screen
Depending on the case you have you may need to rotate the display.
In Terminal, type "sudo nano /boot/config.txt"
Add the line "lcd_rotate=2" to the top of the file.

## Changing brightness of screen
current brightness
cat /sys/class/backlight/rpi_backlight/actual_brightness

Change permissions to avoid needing to run commands as root and then reload these rules 
```
echo 'SUBSYSTEM=="backlight",RUN+="/bin/chmod 666 /sys/class/backlight/%k/brightness /sys/class/backlight/%k/bl_power"' | sudo tee -a /etc/udev/rules.d/backlight-permissions.rules

sudo udevadm control --reload-rules && sudo udevadm trigger
```

Change brightness (0 - 255)
```
echo 100 > /sys/class/backlight/rpi_backlight/brightness
```

## Changing X settings
Query settings
xset -d :0 -q

Turn off screen saver
xset -d :0 s off

Turn off/on screen (sleep is just required when typing in terminal)
sleep 1; xset -d :0  dpms force off
sleep 1; xset -d :0  dpms force on

Change screen off time to 10 seconds. Params are standby, suspend, off
xset dpms -d:0 0 0 10

Turn off screen timeout
xset dpms -d:0 0 0 0