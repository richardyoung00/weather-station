const template = (obj) => /*html*/
`
<style>
    :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex: 50;
    }


</style>

    <div>Weather data here</div>


`

customElements.define('weather-summary',
    class WeatherSummary extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
            this.render();
        }


        render() {
            this.shadow.innerHTML = template(this);
        }
    }
)