import board
import busio
import adafruit_veml7700
import json
    
i2c = busio.I2C(board.SCL, board.SDA)
veml7700 = adafruit_veml7700.VEML7700(i2c)

res = {
    "ambient_light": veml7700.light,
    "lux": veml7700.lux,
}
print(json.dumps(res))

