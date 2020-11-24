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