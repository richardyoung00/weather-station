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

</style>

    <div id="temperature">
        <span id="temperature-value">-</span>
        <span id="temperature-symbol">°C</span>
    </div>
    <div id="humidity">
        <span>Humidity: </span>
        <span id="humidity-value">-</span>
        <span>%</span>
    </div>


`

customElements.define('outdoor-sensors',
    class OutdoorSensors extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });

            window.addEventListener('sensor_value', (e) => {

                const data = e.detail;
                console.log(data)
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
            console.log('updating')
            if (data.type === 'temperature') {
            console.log('t')

                this.shadow.querySelector('#temperature-value').innerText = data.value.toFixed(1)
            }
            if (data.type === 'humidity') {
                this.shadow.querySelector('#humidity-value').innerText = data.value
            }
        }
    }
)