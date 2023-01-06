const SPEED = .02;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value);
  }

  get rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    if (this.paddleElem.classList.contains("computer")) {
    this.position = 50;
    }
  }

  update(ballHeight, delta) {
    this.position += SPEED * delta * (ballHeight - this.position);
  }
}
