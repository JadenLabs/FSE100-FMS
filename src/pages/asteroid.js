class AsteroidPage extends Page {
  constructor() {
    super("asteroid");
    this.backButton = new BackButton();

    this.asteroid_radius = 23;
    this.asteroids = [];
    this.asteroids.push(
      new Asteroid(
        random(0, canvas.x - this.asteroid_radius * 2),
        canvas.q[0].y,
        this.asteroid_radius,
        {
          x: -2,
          y: 4,
        }
      ),
      new Asteroid(
        random(0, canvas.x - this.asteroid_radius * 2),
        canvas.q[0].y,
        this.asteroid_radius,
        {
          x: -2,
          y: 3,
        }
      ),
      new Asteroid(
        random(0, canvas.x - this.asteroid_radius * 2),
        canvas.q[0].y,
        this.asteroid_radius,
        {
          x: 2,
          y: 2,
        }
      ),
      new Asteroid(
        random(0, canvas.x - this.asteroid_radius * 2),
        canvas.q[0].y,
        this.asteroid_radius,
        {
          x: 2,
          y: 3,
        }
      )
    );

    this.player = new Player(canvas.m.x, canvas.q[2].y, 40, 45);

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  show() {
    image(asteroidbg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({ title: "Asteroid", widthOffset: 90, yOffset: -20 });
    this.backButton.show();

    for (let asteroid of this.asteroids) {
      asteroid.update();
    }

    this.player.update();
  }
}

class Asteroid {
  constructor(x, y, radius, velocity) {
    // Offset x and y because image() draws using the top left corner
    let topLeft = { x, y };
    this.x = topLeft.x - radius;
    this.y = topLeft.y - radius;
    this.radius = radius;
    this.velocity = velocity;
  }

  update() {
    if (this.x > canvas.x || this.y > canvas.y) {
      // Reset position to top
      this.x = random(0, canvas.x - this.radius * 2);
      this.y = -this.radius * 2;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }

  draw() {
    image(asteroid, this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

class Player {
  constructor(x, y, w, h) {
    Object.assign(this, { x, y, w, h });
  }

  update() {
    this.draw();
  }

  draw() {
    fill(255);
    image(eggImg, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}

function checkCollion(asteroid, player) {
    let dx = asteroid.x - player.x;
    let dy = asteroid.y - player.y;

    let angle = Math.atan(dx / dy);

    x = asteroid.x + asteroid.radius * Math.sin(angle);
    y = asteroid.y + asteroid.radius * Math.cos(angle);


}