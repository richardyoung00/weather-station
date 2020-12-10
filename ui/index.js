import './components/home-page.js'
import './components/clock-display.js'
import './components/indoor-sensors.js'

const refreshButton = document.querySelector('.refresh-button ion-button')

refreshButton.addEventListener('click', (e) => {
    location.reload();
})

const socket = io();

socket.on("connect", () => {
    console.log("connected to server");
});

socket.on("sensor_value", (arg) => {
    console.log(arg);
});