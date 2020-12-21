const template = (obj) => /*html*/
`
<style>
    :host {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #left {
        flex: 50; 
        display: flex;
        flex-direction: column;
    }
    
    #right {
        flex: 50; 
        display: flex;
        flex-direction: column;
    }
</style>

<div id="left">
    <clock-display></clock-display>
    <indoor-sensors></indoor-sensors>
</div>

<div id="right">
    <weather-summary></weather-summary>
    <outdoor-sensors></outdoor-sensors>
</div>


`

customElements.define('home-page',
    class HomePage extends HTMLElement {
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