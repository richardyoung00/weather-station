import Adafruit_DHT
import json

DHT_SENSOR = Adafruit_DHT.DHT22

DHT_PIN = 22

humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

res = {
    "temperature": temperature,
    "humidity": humidity,
}
print(json.dumps(res))