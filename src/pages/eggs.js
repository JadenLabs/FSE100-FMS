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
    this.eggs = [];
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
  }

  createEgg(x, y, w, h) {
    let egg = new EggButton({ x, y, w, h, parent: this });
    this.eggs.push(egg);
    this.drawables.push(egg);
    this.clickables.push(egg);
    console.log(this.eggs);
    console.log(egg);
  }

  onEggClicked(egg) {
    this.score += 100;
    egg.x = Math.floor(random(50, canvas.x - 50));
    egg.y = Math.floor(random(50, canvas.y - 50));
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

    for (const egg of this.eggs) {
      egg.show();
    }
  }
}

class EggButton extends Button {
  constructor({ x, y, w, h, parent }) {
    super({ x, y, w, h, onClick: () => { parent.onEggClicked(this); } });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.parent = parent;
  }

  show() {
    console.log("showing egg");
    image(eggImg, this.x, this.y, this.w - 8, this.h - 8);
    text("Score: " + this.score, canvas.x - 145, canvas.y - 315);
  }
}
