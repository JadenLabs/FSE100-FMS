class Button {
  constructor({ x, y, w, h, onClick = () => {} }) {
    Object.assign(this, { x, y, w, h, onClick });
    this.isHovered = false;
  }

  contains(mx, my) {
    return (
      mx >= this.x - this.w / 2 &&
      mx <= this.x + this.w / 2 &&
      my >= this.y - this.h / 2 &&
      my <= this.y + this.h / 2
    );
  }

  update() {
    this.isHovered = this.contains(mouseX, mouseY);
  }

  handleClick() {
    if (this.onClick) this.onClick();
  }
}