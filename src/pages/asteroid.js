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

        this.player.update();

        for (let asteroid of this.asteroids) {
            asteroid.update();
            if (checkCollion(asteroid, this.player)) {
            }
        }
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
        // TODO draw a trail
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

    fill(col);
    stroke(col);
    circle(x, y, 5);
    circle(ax, ay, 3);
    circle(px, py, 3);
    // line(ax, ay, x, y);
    // line(ax, ay, px, py);

    if (colliding) {
        console.log("COLLISION");
        return true;
    }

    return false;
}
