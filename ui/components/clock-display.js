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

    #time {
        font-size: 7rem;
    }

    #date {
        font-size: 1.8em;
    }


</style>

<div id="time"></div>
<div id="date"></div>


`

customElements.define('clock-display',
    class ClockDisplay extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this.render();
        }

        renderTime() {
            let dateTime = new Date();
            const timeString = dateTime.toLocaleTimeString('en-ZA').slice(0, 5)
            this.shadow.querySelector('#time').innerText = timeString
            this.shadow.querySelector('#date').innerText = dateTime.toDateString()
        }

        start() {
            this.renderTime()
            setInterval(() => this.renderTime(), 1000)
        }

        render() {
            this.shadow.innerHTML = template(this);
            this.start()
        }
    }
)