class AsteroidPage extends Page {
  constructor() {
    super("asteroid");
    this.backButton = new BackButton();

    this.player = new Player(canvas.m.x, canvas.q[2].y, 40, 45);

    this.asteroid_radius;
    switch (difficulty) {
      case "easy":
        this.asteroid_radius = 23;
        break;
      case "medium":
        this.asteroid_radius = 22;
        break;
      case "hard":
        this.asteroid_radius = 20;
        break;
    }

    this.asteroids = [];
    for (let i = 0; i < this.asteroidsOnScreen(0); i++) {
      this.asteroids.push(
        new Asteroid({ player: this.player, radius: this.asteroid_radius })
      );
    }

    this.maxLives = 3;
    switch (difficulty) {
      case "easy":
        this.maxLives = 5;
        break;
      case "medium":
        this.maxLives = 4;
        break;
      case "hard":
        this.maxLives = 3;
        break;
    }
    this.lives = this.maxLives;
    this.score = 0;
    this.gameElapesedTimeMS = -500;
    this.timeHit;

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton, this.player);
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  show() {
    // Shake
    let timeSinceHit = this.gameElapesedTimeMS - this.timeHit;
    if (this.timeHit && timeSinceHit < 500) {
      let shakeMagnitude = map(timeSinceHit, 0, 500, 6.7, 0);
      let shakeX = random(-shakeMagnitude, shakeMagnitude);
      let shakeY = random(-shakeMagnitude, shakeMagnitude);
      translate(shakeX, shakeY);
    } else if (!this.timeHit || timeSinceHit >= 500) {
      for (let asteroid of this.asteroids) {
        let distance = dist(
          asteroid.x + asteroid.radius,
          asteroid.y + asteroid.radius,
          this.player.x,
          this.player.y
        );
        if (distance >= 150) continue;
        let shakeMagnitude = map(distance, 150, 0, 0, 2);
        let shakeX = random(-shakeMagnitude, shakeMagnitude);
        let shakeY = random(-shakeMagnitude, shakeMagnitude);
        translate(shakeX, shakeY);
        break;
      }
    }

    this.gameElapesedTimeMS += deltaTime;
    image(asteroidbg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({ title: "Asteroid", widthOffset: 90, yOffset: -20 });

    let nAsteroids = this.asteroidsOnScreen(
      Math.floor(this.gameElapesedTimeMS / 1000)
    );
    while (this.asteroids.length < nAsteroids) {
      this.asteroids.push(
        new Asteroid({ player: this.player, radius: this.asteroid_radius })
      );
    }

    for (let asteroid of this.asteroids) {
      asteroid.update();
      if (checkCollion(asteroid, this.player)) this.handleCollision(asteroid);
      else if (
        asteroid.y > canvas.y ||
        asteroid.x > canvas.x ||
        asteroid.x < 0
      ) {
        this.score += 10;
      }
    }

    this.backButton.show();

    this.player.update();

    displayHearts({
      total: this.maxLives,
      remaining: this.lives,
      base_x: canvas.q[1].x - 50,
      base_y: 20,
    });
    displayScore({ score: this.score });

    if (this.timeHit && timeSinceHit < 500) {
      let alpha = map(timeSinceHit, 0, 500, 0.4, 0);
      drawVignette([200, 0, 0, alpha], [200, 0, 0, alpha]);
    }
  }

  handleCollision(asteroid) {
    // Make the asteroid explode - needs animation
    // Create broken asteroid object
    // Reset asteroid positions
    asteroid.resetPosition();

    // Update time hit
    this.timeHit = this.gameElapesedTimeMS;

    // Break egg
    this.player.hits++;

    // Decrease lives
    this.lives--;
    if (this.lives <= 0) {
      finalScore = this.score;
      changePage("end");
    }
  }

  asteroidsOnScreen(time) {
    let exponent = time / 50;
    let numerator = 25 * Math.exp(exponent);
    let denominator = 6 + Math.exp(exponent);
    let asteroids = Math.floor(numerator / denominator);
    console.log(asteroids);

    return asteroids;
  }
}

class Asteroid {
  constructor({ player, radius = 23 } = {}) {
    // Offset x and y because image() draws using the top left corner
    this.radius = radius;
    this.particles = [];
    this.player = player;
    this.turnSpeed = 0.001;
    this.theta = 0;
    this.yVelocitySettings = {
      easy: { min: 1, max: 2 },
      medium: { min: 2, max: 3 },
      hard: { min: 2, max: 4 },
    };
    this.resetPosition();
  }

  resetPosition() {
    this.x = random(0, canvas.x - this.radius * 2);
    this.y = -this.radius * 2;
    let yVelocityRange = this.yVelocitySettings[difficulty];

    this.velocity = {
      x: random([-2, 2]),
      y: this.randomVelocity(yVelocityRange.min, yVelocityRange.max),
    };
  }

  update() {
    if (this.x > canvas.x || this.y > canvas.y || this.x < 0) {
      // Reset position to top
      this.resetPosition();
    }

    let driftStrength = 0.02;
    let dir = Math.sign(this.player.x - this.x);
    this.velocity.x += dir * driftStrength;
    this.velocity.x = constrain(this.velocity.x, -4, 4);

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.theta -= this.turnSpeed * 4;

    this.spawnParticle();

    this.particles = this.particles.filter((p) => {
      p.update();
      return p.radius > 0;
    });

    this.draw();
  }

  spawnParticle() {
    let m = {
      x: this.x + this.radius,
      y: this.y + this.radius,
    };

    let x = random(-this.radius / 2, this.radius / 2) + m.x;
    let perpSlope = -this.velocity.x / this.velocity.y;
    let y = perpSlope * (x - m.x) + m.y;

    this.particles.push(new Particle(x, y, 10));
  }

  draw() {
    // Do something when near player
    let distance = dist(
      this.x + this.radius,
      this.y + this.radius,
      this.player.x,
      this.player.y
    );
    if (distance < 150) {
      fill(214, 84, 24, map(distance, 0, 150, 150, 0));
      noStroke();
      circle(this.x + this.radius, this.y + this.radius, 150 - distance);
    }

    push();
    translate(this.x + this.radius, this.y + this.radius);
    rotate(this.theta);
    image(
      asteroid,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2
    );
    pop();
  }

  randomVelocity(min, max) {
    let rand = random(-3, 3);
    return Math.min(max, (max - min) * Math.exp(-rand * rand) + min);
  }
}

class Particle {
  // Mid x and mid y from asteroid
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.opacity = 0.67;
  }

  update() {
    this.radius -= 0.2;
    this.opacity -= 0.01;
    this.draw();
  }

  draw() {
    fill(`rgba(171, 60, 9, ${this.opacity})`);
    noStroke();

    circle(this.x, this.y, this.radius);
  }
}

class Player extends Button {
  constructor(x, y, w, h) {
    super({ x, y, w, h });
    Object.assign(this, { x, y, w, h });
    this.isDragging = false;
    this.speed = 5;
    this.hits = 0;
  }

  update() {
    super.update();
    this.draw();

    if (mouseIsPressed) {
      if (this.x < 0) this.x = 0;
      else if (this.x > canvas.x) this.x = canvas.x;
      if (this.y < 0) this.y = 0;
      else if (this.y > canvas.y) this.y = canvas.y;
      else {
        if (Math.abs(this.x - mouseX) > 5 || Math.abs(this.y - mouseY) > 5) {
          let theta = Math.atan2(mouseY - this.y, mouseX - this.x);
          this.x += round(this.speed * Math.cos(theta), 0);
          this.y += round(this.speed * Math.sin(theta), 0);
        }
      }
    }
  }

  draw() {
    fill(255);
    let eggImage = getEggByStage(this.hits);
    image(eggImage, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}

function checkCollion(asteroid, player) {
  const ax = asteroid.x + asteroid.radius;
  const ay = asteroid.y + asteroid.radius;

  const px = player.x;
  const py = player.y;

  const dx = ax - px;
  const dy = ay - py;

  let angle = Math.atan2(dx, dy);

  x = ax - asteroid.radius * Math.sin(angle);
  y = ay - asteroid.radius * Math.cos(angle);

  colliding =
    x > px - player.w / 2 &&
    x < px + player.w / 2 &&
    y > py - player.h / 2 &&
    y < py + player.h / 2;

  col = colliding ? "red" : "green";

  // fill(col);
  // stroke(col);
  // circle(x, y, 5);
  // circle(ax, ay, 3);
  // circle(px, py, 3);
  // line(ax, ay, x, y);
  // line(ax, ay, px, py);

  if (colliding) {
    // console.log("COLLISION");
    return true;
  }

  return false;
}
