from bluepy import btle, thingy52
import binascii
from multiprocessing import Process, Manager
import json

from services.remote_sensors import RemoteSensorService

from flask import Flask, request, jsonify

app = Flask(__name__, static_url_path='', static_folder='ui')

@app.route('/')
def home_page():
    return app.send_static_file('index.html')

def init_state(state):
    with open('config/remote_sensors.json') as f:
        data = json.load(f)
    # todo set all devices to connected = False
    state.update({'remote_sensors': data})

def setup_sensors(state):
    p = Process(target=RemoteSensorService, args=(state,))
    p.start()


if __name__ == "__main__":
    with Manager() as manager:
        state = manager.dict()
        init_state(state)
        setup_sensors(state)


        app.run(host='0.0.0.0', port=5000)