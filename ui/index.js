import './components/home-page.js'
import './components/clock-display.js'
import './components/indoor-sensors.js'

const refreshButton = document.querySelector('.refresh-button ion-button')

refreshButton.addEventListener('click', (e) => {
    location.reload();
})