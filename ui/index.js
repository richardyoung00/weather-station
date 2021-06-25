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

socket.on("data", (value) => {
    console.log(value)
    // window.dispatchEvent(new CustomEvent('sensor_value', { detail: value }))
});

function hideCursorForTouch() {
    const isTouch = !!('ontouchstart' in window || navigator.maxTouchPoints)

    if (isTouch) {
        document.body.style.cursor = 'none'
    }
}

hideCursorForTouch()