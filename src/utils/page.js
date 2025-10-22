class Page {
  /**
   * Ran the first time the object is created
   */
  constructor(id) {
    this.id = id;
    this.drawables = [];
    this.clickables = [];
    this.active = false;
  }

  /**
   * (OVERRIDE) Ran on each draw program call.
   */
  update() {
    let hovering = false;

    for (const drawable of this.drawables) {
      if (drawable.update) drawable.update();
    }

    for (const clickable of this.clickables) {
      if (clickable.contains?.(mouseX, mouseY)) hovering = true;
      if (
        clickable.handleClick &&
        clickable.contains?.(mouseX, mouseY) &&
        mouseIsPressed
      ) {
        clickable.handleClick();
      }
    }

    cursor(hovering ? HAND : ARROW);
    this.show();
  }

  /**
   * (OVERRIDE) Ran on each draw program call.
   */
  show() {}

  /**
   * (OVERRIDE) Ran when the page is loaded for the first time.
   */
  enter() {
    this.active = true;
  }

  /**
   * (OVERRIDE) Ran when the page is unloaded.
   */
  exit() {
    this.active = false;
  }
}
