class MainPage extends Page {
  /**
   * Ran the first time the page is created
   */
  constructor() {
    super("main");

    this.gameButtons = [
      new MainMenuButton({
        x: canvas.q[0].x,
        y: canvas.m.y,
        buttonColor: "#FFAB49",
        hoverColor: "#C98537",
        buttonText: "Eggs",
        image: eggImg,
        onClick: () => { uiButtonClick.play(); changePage("difficulty"); nextPage = "eggs"; },
      }),
      new MainMenuButton({
        x: canvas.m.x,
        y: canvas.m.y,
        buttonColor: "#7EA0A1",
        hoverColor: "#627C7C",
        buttonText: "Asteroid",
        image: asteroid,
        onClick: () => { uiButtonClick.play(); changePage("difficulty"); nextPage = "asteroid"; },
      }),
      new MainMenuButton({
        x: canvas.q[1].x,
        y: canvas.m.y,
        buttonColor: "#ABBC3C",
        hoverColor: "#919F35",
        buttonText: "Maze",
        image: mazemain,
        onClick: () => { uiButtonClick.play(); changePage("difficulty"); nextPage = "maze"; },
      }),
    ];

    this.drawables.push(...this.gameButtons);
    this.clickables.push(...this.gameButtons);
  }

  /**
   * Ran when the page is loaded for the first time.
   */
  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  /**
   * Called on each program draw
   */
  show() {
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({title: "Dinosaur Island", yOffset: -20});

    for (const button of this.gameButtons) {
      button.show();
    }
  }
}

class MainMenuButton extends Button {
  constructor({
    x,
    y,
    w = 150,
    h = 150,
    buttonText = "Click Me",
    buttonColor = "#EAE2D8",
    hoverColor = "#B7B0A8",
    cornerRadius = 30,
    image = null,
    onClick = () => {},
  }) {
    super({ x, y, w, h, onClick });
    Object.assign(this, { buttonText, buttonColor, hoverColor, cornerRadius, image });
  }

  update() {
    super.update();
    this.activeColor = this.isHovered ? this.hoverColor : this.buttonColor;
  }

  show() {
    if (this.isHovered) {
      fill("rgba(0, 0, 0, 0.5)");
      rect(this.x + 3, this.y + 3, this.w, this.h, this.cornerRadius);
    }

    fill(this.activeColor);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.cornerRadius);

    fill("#EAE2D8");
    rect(this.x, this.y + 70, this.w - 30, 50, this.cornerRadius);

    if (this.image) {
      imageMode(CENTER);
      image(this.image, this.x, this.y - 10, this.h * 0.6, this.h * 0.6);
      imageMode(CORNER);
    }

    fill(0);
    textSize(28);
    text(this.buttonText, this.x, this.y + 70);
  }
}
