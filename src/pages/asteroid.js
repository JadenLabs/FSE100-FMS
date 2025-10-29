class AsteroidPage extends Page {
    constructor() {
        super("asteroid");
        this.backButton = new BackButton();

        this.asteroid_radius = 23;
        this.asteroids = [];
        this.asteroids.push(
            new Asteroid(canvas.m.x, canvas.q[0].y, this.asteroid_radius, {
                x: -2,
                y: 3,
            })
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
        image(backgroundImg, 0, 0, canvas.x, canvas.y);
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
