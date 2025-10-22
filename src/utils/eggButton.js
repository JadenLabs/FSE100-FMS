class EggButton extends Button {
  constructor({ x, y, w, h }) {
    super({ x, y, w, h, onClick: () => { } });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.onClick = () => {
      this.score = this.score + 100;
      this.x = random(50, canvas.x - 50);
      this.y = random(50, canvas.y - 50);
    }
  }

  show() {
    console.log("showing egg");
    image(eggImg, this.x, this.y, this.w, this.h);
  }
}