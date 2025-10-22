class EggsPage extends Page {
  constructor() {
    super("eggs");
    this.backButton = new BackButton({
      x: 40,
      y: 30,
      h: 45,
      w: 45,
      onClick: () => {
        changePage("main");
      },
    });

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    
  }

  show() {
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({ title: "Eggs", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    let score = 0;
    text("Score: "+score, 45, 55);
  }
}
