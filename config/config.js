import fs from 'fs';

const fsPromises = fs.promises;


export async function readConfig() {
    const config = {};
    config.remote_sensors = JSON.parse(await fsPromises.readFile('./config/remote_sensors.json'))

    return config;
}