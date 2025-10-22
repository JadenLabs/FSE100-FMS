class EggButton extends Button {
  constructor({ x, y, w, h }) {
    super({ x, y, w, h, onClick: () => {} });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    console.log("im gonna goon")
  }

  show() {
    console.log("showing egg");
    image(eggImg, this.x, this.y, this.w, this.h);
  }
}
