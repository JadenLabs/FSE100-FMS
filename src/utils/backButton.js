class BackButton extends Button {
  constructor({
    x = 40,
    y = 30,
    h = 45,
    w = 55,
    onClick = () => {
      changePage("main");
    },
  } = {}) {
    super({ x, y, w, h, onClick });
  }

  show() {
    image(backButton, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}
