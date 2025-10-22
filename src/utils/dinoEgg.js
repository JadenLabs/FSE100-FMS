class DinoEgg {
  constructor(x, y, w, h, baseColor) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // friendly pastel colors if none provided
    this.baseColor = baseColor || color(random(150, 255), random(150, 255), random(150, 255));

    this.spots = [];
    this.generateSpots();
  }

  generateSpots() {
    const count = 8 + int(random(6)); // fewer, larger spots
    for (let i = 0; i < count; i++) {
      const angle = random(TWO_PI);
      const r = random(0, 0.35) * this.w;
      const x = this.x + r * cos(angle);
      const y = this.y + r * sin(angle) * 1.3;
      this.spots.push({
        x,
        y,
        size: random(this.w * 0.08, this.w * 0.18),
        c: color(random(50, 200), random(50, 200), random(50, 200), 180)
      });
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    noStroke();

    // soft shadow
    fill(0, 0, 0, 40);
    ellipse(5, this.h * 0.45, this.w * 0.9, this.h * 0.15);

    // egg body
    fill(this.baseColor);
    ellipse(0, 0, this.w, this.h);

    // subtle highlight
    fill(255, 255, 255, 60);
    ellipse(-this.w * 0.15, -this.h * 0.25, this.w * 0.5, this.h * 0.3);

    // spots
    for (const s of this.spots) {
      fill(s.c);
      ellipse(s.x - this.x, s.y - this.y, s.size);
    }

    pop();
  }
}
