class BackButton extends Button {
  constructor({ x, y, w, h, onClick = () => {} }) {
    super({ x, y, w, h, onClick });
  }

  show() {
    image(backButton, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}
