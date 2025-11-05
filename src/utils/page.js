class Page {
  constructor(id) {
    this.id = id;
    this.drawables = [];
    this.clickables = [];
    this.active = false;

    // track previous mouse state for edge detection
    this._prevMousePressed = false;
  }

  update() {
    let hovering = false;
    const nowPressed = !!mouseIsPressed;
    const mouseJustPressed = nowPressed && !this._prevMousePressed;

    for (const drawable of this.drawables) {
      if (drawable.update) drawable.update();
    }

    for (const clickable of this.clickables) {
      if (clickable.contains?.(mouseX, mouseY)) hovering = true;

      if (
        clickable.handleClick &&
        clickable.contains?.(mouseX, mouseY) &&
        mouseJustPressed
      ) {
        if (!pageClickedWithin(300)) {
          clickable.handleClick();
          pageLastClicked = Date.now();
          break;
        }
      }
    }

    this._prevMousePressed = nowPressed;

    cursor(hovering ? HAND : ARROW);
    this.show();
  }

  show() {}
  enter() { this.active = true; }
  exit() { this.active = false; }
}