class eggButton extends Button {
  constructor({ x, y, w, h }) {
    super({ x, y, w, h, onClick: () => {} });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    image(eggImg, x, y, w, h);
  }
}

function preload() {
  eggImg = loadImage("assets/egg.jpg");
}
