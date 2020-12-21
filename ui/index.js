import './components/home-page.js'
import './components/clock-display.js'
import './components/indoor-sensors.js'
import './components/outdoor-sensors.js'
import './components/weather-summary.js'

const refreshButton = document.querySelector('.refresh-button ion-button')

refreshButton.addEventListener('click', (e) => {
    location.reload();
})

const socket = io();

socket.on("connect", () => {
    console.log("connected to server");
});

socket.on("sensor_value", (value) => {
    window.dispatchEvent(new CustomEvent('sensor_value', { detail: value }))
});