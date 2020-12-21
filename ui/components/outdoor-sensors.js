const template = (obj) => /*html*/
`
<style>
    :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex: 50;
    }

    #temperature {
        font-size: 6rem;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
    }

    #temperature-symbol {
        font-size: 0.3em;
        margin-top: 0.5em;
        margin-left: 0.5em;
    }

    #humidity {
        font-size: 1.8em;
    }

    #sensor-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 2em;
    }

    .gg-battery {
        box-sizing: border-box;
        position: relative;
        display: block;
        margin-left: 12px;
        width: 20px;
        height: 12px;
        
        border: 2px solid;
        border-radius: 3px;

    }
    .gg-battery .slider,
    .gg-battery .point {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
        height: 6px;
        background: currentColor;
        top: 1px
    }
    .gg-battery .point {
        right: -4px;
        border-radius: 3px;
        width: 4px
    }
    .gg-battery .slider {
        width: 0px;
        left: 1px
    }

</style>

    <div id="temperature">
        <span id="temperature-value">---</span>
        <span id="temperature-symbol">°C</span>
    </div>
    <div id="humidity">
        <span>Humidity: </span>
        <span id="humidity-value">--</span>
        <span>%</span>
    </div>

    <div id="sensor-info">
        <span id="sensor-name">-----</span>
        <span class="gg-battery">
            <span class="slider"></span>
            <span class="point"></span>
        </span>
    </div>
    

`

const REMOTE_SENSOR_TIMEOUT = 120000

const BATTERY_ICON_WIDTH = 14;

customElements.define('outdoor-sensors',
    class OutdoorSensors extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });

            window.addEventListener('sensor_value', (e) => {
                const data = e.detail;
                if (data.source === 'remote') {
                    this.updateValue(data)
                }
            })
        }

        connectedCallback() {
            this.render();
        }


        render() {
            this.shadow.innerHTML = template(this);
        }

        updateValue(data) {
            if (data.type === 'temperature') {
                this.shadow.querySelector('#temperature-value').innerText = data.value.toFixed(1)
                clearTimeout(this.tempTimeout)
                this.tempTimeout = setTimeout(() => {
                    this.shadow.querySelector('#temperature-value').innerText = '---'
                }, REMOTE_SENSOR_TIMEOUT)
            }

            if (data.type === 'humidity') {
                this.shadow.querySelector('#humidity-value').innerText = data.value
                clearTimeout(this.humTimeout)
                this.humTimeout = setTimeout(() => {
                    this.shadow.querySelector('#humidity-value').innerText = '--'
                }, REMOTE_SENSOR_TIMEOUT)
            }

            if (data.type === 'battery') {
                this.shadow.querySelector('#sensor-name').innerText = data.device
                const pixelWidth = (Number(data.value) / 100) * BATTERY_ICON_WIDTH
                console.log( Math.round(pixelWidth))
                this.shadow.querySelector('.slider').style.width = `${Math.round(pixelWidth)}px`
            }
        }
    }
)