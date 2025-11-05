class EggsPage extends Page {
  constructor() {
    super("eggs");
    this.backButton = new BackButton({
      x: 40,
      y: 30,
      h: 45,
      w: 45,
      onClick: () => {
        this.score = 0;
        changePage("main");
      },
    });

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);

    this.score = 0;
    this.eggs = [];
    this.scoreInc;
    switch(difficulty){

      case "easy":
        console.log(difficulty);
        this.scoreInc = 100;
      this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        break;




      case "medium":
        console.log(difficulty);
        this.scoreInc = 50;
        this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        break;




      case "hard":
        console.log(difficulty);
        this.scoreInc = 25;
        this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
    this.createEgg(
      Math.floor(random(canvas.x)),
      Math.floor(random(canvas.y)),
      50,
      55
    );
        break;
    }

  }

  createEgg(x, y, w, h) {
    let egg = new EggButton({ x, y, w, h, parent: this });
    this.eggs.push(egg);
    this.drawables.push(egg);
    this.clickables.push(egg);

  }

  onEggClicked(egg) {
    
    if(egg.visible){
      this.score += this.scoreInc;
      this.delayEgg(egg, random(500, 3000));
    }
    else{
      this.score+=0;
    }
    egg.visible = false;
    
  }

  delayEgg(egg, time) {
    setTimeout(() => {
      egg.visible = true;
      egg.x = Math.floor(random(50, canvas.x - 50));
      egg.y = Math.floor(random(75, canvas.y - 50));
    }, time);
  }


  show() {
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    drawGameTitle({ title: "Eggs", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    for (const egg of this.eggs) {
      egg.show();
    }
    text("Score: " + this.score, canvas.x - 145, canvas.y - 315);
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
    this.visible = true;
  }

  show() {
    if (!this.visible){
      image(stars, this.x - (this.w/2)-10, this.y - (this.h/2), this.w+30, this.h+30);
       return; // don't draw if hidden
    }
    image(eggImg, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}
