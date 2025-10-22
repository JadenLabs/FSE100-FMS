class Canvas {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.m = { x: this.x / 2, y: this.y / 2 };
    this.q = [
      { x: this.m.x / 2, y: this.m.y / 2 },
      { x: this.m.x + this.m.x / 2, y: this.m.y / 2 },
      {
        x: this.m.x + this.m.x / 2,
        y: this.m.y + this.m.y / 2,
      },
      { x: this.m.x / 2, y: this.m.y + this.m.y / 2 },
    ];
  }
}