const INITIAL_VELOCITY = 0.04;
const VELOCITY_INCREASE = 0.000002;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  show() {
    this.ballElem.style.display = "block";
  }

  hide() {
    this.ballElem.style.display = "none";
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;

    this.direction = { x: 0 };
  
    const angle = randomNumberBetween(0.174533, Math.PI / 4);

    // launch angle randomized between 10deg and 45deg
    console.log(angle * 180 / Math.PI);

    // direction of launch is randomized between -1 and 1
    const randY = Math.random() < 0.5 ? Math.abs(Math.sin(angle) * 100) : -Math.abs(Math.sin(angle) * 100);

    const randX = Math.random() < 0.5 ? Math.abs(Math.cos(angle) * 100) : -Math.abs(Math.cos(angle) * 100);

    //get unit vector
    const magnitude = Math.sqrt(randX ** 2 + randY ** 2);

    this.direction.x = randX/magnitude;
    this.direction.y = randY/magnitude;

    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;

    const rect = this.rect();

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }

    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(paddleRect, ballRect) {
  return (
    ballRect.left <= paddleRect.right &&
    ballRect.right >= paddleRect.left &&
    ballRect.top <= paddleRect.bottom &&
    ballRect.bottom >= paddleRect.top
  );
}
