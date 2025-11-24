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


    this.MissClickButton = new MissClickButton({
      x: 100,
      y: 150,
      w: 1250,
      h: 450,
      onClick: () => { if(this.score > 0){
        this.missClick();
        this.score = this.score - 100;
      } }
    });

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);
    this.drawables.push(this.MissClickButton);

    this.score = 0;
    this.eggs = [];
    this.scoreInc;
    this.timerValue = 60; // seconds
    this.timerActive = true;
    this.timerElapsed = 0; // milliseconds


    switch (difficulty) {

      case "easy":
        console.log(difficulty);
        this.scoreInc = 100;
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        break;




      case "medium":
        console.log(difficulty);
        this.scoreInc = 50;
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        break;




      case "hard":
        console.log(difficulty);
        this.scoreInc = 25;
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        this.createEgg(
          Math.floor(random(50, canvas.x - 50)),
          Math.floor(random(75, canvas.y - 50)),
          50,
          55
        );
        break;
    }

    this.clickables.push(this.MissClickButton);
  }

  createEgg(x, y, w, h) {
    let egg = new EggButton({ x, y, w, h, parent: this });
    this.eggs.push(egg);
    this.drawables.push(egg);
    this.clickables.push(egg);

  }
  missClick() {
  this.MissClickButton.damage = 80;
  setTimeout(() => this.MissClickButton.damage = 0, 400);
}

  onEggClicked(egg) {
  if (egg.visible) {
    this.score += this.scoreInc;
    egg.showStars = true; 
    egg.visible = false;
    this.delayEgg(egg, random(500, 3000));
  }
  else {
    this.score += 0;
  }
}

  updateTimer() {
    if (!this.timerActive) return;

    this.timerElapsed += deltaTime; // add frame time

    if (this.timerElapsed >= 1000) { // 1 second passed
      this.timerValue--;
      this.timerElapsed = 0;
    }

    if (this.timerValue <= 0) {
      this.timerValue = 0;
      this.timerActive = false;
      console.log("Timer ended!");
    }
  }

  delayEgg(egg, time) {
  setTimeout(() => {
    egg.visible = true;
    egg.showStars = false;
    egg.x = Math.floor(random(50, canvas.x - 50));
    egg.y = Math.floor(random(75, canvas.y - 50));
    egg.lifeLeft = egg.maxLife;
    egg.lastUpdateTime = null;
  }, time);
}


  show() {
    image(eggBG, 0, 0, canvas.x, canvas.y);
    this.MissClickButton.show();
    drawGameTitle({ title: "Eggs", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    for (const egg of this.eggs) {
      egg.update();
      egg.show();
    }
    this.updateTimer();
    text("Score: " + this.score, canvas.x - 145, canvas.y - 315);
    textSize(25);
    text("Time left: "+ this.timerValue, canvas.x - 570, canvas.y - 320);
    if (this.timerValue <= 0) {
            finalScore = this.score;
            changePage("end");
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

  this.theta = random(0, TWO_PI);
  this.speed = 0;
  this.dtheta = 0.0;

  switch (difficulty) {
    case "easy":
      this.speed = 0;
      this.dtheta = 0;
      this.maxLife = 3000;
      break;
    case "medium":
      this.speed = random(0.7, 1.2);
      this.dtheta = random(-0.02, 0.02);
      this.maxLife = 4000;
      break;
    case "hard":
      this.speed = random(2, 3);
      this.dtheta = random(-0.03, 0.03);
      this.maxLife = 5500;
      break;
  }

  this.parent = parent;
  this.visible = true;
  this.showStars = false;

  
  this.lifeLeft = this.maxLife;
}

update() {
  if (!this.visible) return;

  if (!this.lastUpdateTime) {
    this.lastUpdateTime = Date.now();
  }

  let currentTime = Date.now();
  let timePassed = currentTime - this.lastUpdateTime;
  
  this.lifeLeft -= timePassed;
  this.lastUpdateTime = currentTime;

  if (this.lifeLeft <= 0) {
    this.parent.score -= 10;   
    this.visible = false;
    this.showStars = false;  // NO STARS when timer runs out
    this.lastUpdateTime = null;
    
    this.parent.delayEgg(this, random(500, 3000));
  }
}


shake() {
    if (this.x < 50) this.x = 50;
    if (this.x > canvas.x - 50) this.x = canvas.x - 50;
    if (this.y < 75) this.y = 75;
    if (this.y > canvas.y - 50) this.y = canvas.y - 50;

    this.theta += this.dtheta;
    let dx = this.speed * cos(this.theta);
    let dy = this.speed * sin(this.theta);

    this.x += dx;
    this.y += dy;
  }

  reset() {
    this.x = random(50, canvas.x - 50);
    this.y = random(75, canvas.y - 50);
    this.lifeLeft = this.maxLife;
    this.visible = true;
  }

  show() {
  this.shake();
  
  if (!this.visible && this.showStars) {
    image(stars, this.x - (this.w / 2) - 10, this.y - (this.h / 2), this.w + 30, this.h + 30);
    return;
  }
  
  if (!this.visible) {
    return;
  }

  image(eggImg, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
}
}


class MissClickButton extends Button {
  constructor({ x, y, w, h, onClick }) {
    super({ x, y, w, h, onClick });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.damage = 0;
  }

  show() {
    fill(250,0,0,this.damage);
    rect(this.x, this.y, this.w, this.h);
  }
}