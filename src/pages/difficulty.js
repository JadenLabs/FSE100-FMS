class DifficultyPage extends Page {
  constructor() {
    super("difficulty");

    this.backButton = new BackButton();

    this.difficultyButtons = [
      new DifficultyButton({
        x: canvas.q[0].x,
        y: canvas.m.y,
        buttonText: "Easy",
        buttonColor: "#8BC34A",
        hoverColor: "#76A53F",
        onClick: () => {
          difficulty = "easy";
          changePage(nextPage);
          nextPage = null;
        },
      }),
      new DifficultyButton({
        x: canvas.m.x,
        y: canvas.m.y,
        buttonText: "Medium",
        buttonColor: "#CCAE4F",
        hoverColor: "#B79C47",
        onClick: () => {
          difficulty = "medium";
          changePage(nextPage);
          nextPage = null;
        },
      }),
      new DifficultyButton({
        x: canvas.q[1].x,
        y: canvas.m.y,
        buttonText: "Hard",
        buttonColor: "#C6635D",
        hoverColor: "#B65B56",
        onClick: () => {
          difficulty = "hard";
          changePage(nextPage);
          nextPage = null;
        },
      }),
    ];

    this.drawables.push(this.backButton, ...this.difficultyButtons);
    this.clickables.push(this.backButton, ...this.difficultyButtons);
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  show() {
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({ title: "Difficulty", widthOffset: 50, yOffset: -20 });
    this.backButton.show();

    for (const button of this.difficultyButtons) {
      button.show();
    }
  }
}

class DifficultyButton extends Button {
  constructor({
    x,
    y,
    w = 150,
    h = 150,
    buttonText = "Click Me",
    buttonColor = "#EAE2D8",
    hoverColor = "#B7B0A8",
    cornerRadius = 30,
    onClick = () => {},
  }) {
    super({ x, y, w, h, onClick });
    Object.assign(this, { buttonText, buttonColor, hoverColor, cornerRadius });
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

    fill(0);
    textSize(28);
    text(this.buttonText, this.x, this.y + 70);
  }
}
