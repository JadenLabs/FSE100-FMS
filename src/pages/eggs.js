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

    this.score = 100;
    this.eggs=[];
    this.createEgg(100, 250, 50, 55);
  }

  createEgg(x, y, w, h) {
    this.eggs.push(new eggButton({ x, y, w, h }));
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
    text("Score: " + this.score, canvas.x - 145, canvas.y - 315);
    

    for(let egg in this.eggs){
      console.log(egg);
      egg.show();
    }

  }
}
