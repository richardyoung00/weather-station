const template = (obj) => /*html*/
`
<style>
    :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 7rem;
        flex: 40;
    }


</style>

<div id="time">00:00</div>


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
            const timeString = dateTime.toLocaleTimeString().slice(0, 5)
            this.shadow.querySelector('#time').innerText = timeString
        }

        start() {
            setInterval(() => this.renderTime(), 1000)
        }

        render() {
            this.shadow.innerHTML = template(this);
            this.start()
        }
    }
)