export default class PauseMenu {
    constructor(pauseMenuElem) {
        this.pauseMenuElem = pauseMenuElem;

        this.reset();
    }

    reset() {
        console.log("HERE")
        this.pauseMenuElem.style.display = "none";
    }        

    show() {
        this.pauseMenuElem.style.display = "block";
    }

    show(message) {
        this.pauseMenuElem.style.display = "block";
        this.pauseMenuElem.innerHTML = message;
        console.log("MESSAGE: " + message);
    }

    hide() {
        this.pauseMenuElem.style.display = "none";
    }
}