class MazePage extends Page {
  constructor() {
    super("maze");
    this.backButton = new BackButton({
      x: 40,
      y: 30,
      h: 45,
      w: 45,
      onClick: () => {
        this.hearts = this.maxHearts;
        changePage("main");
      },
    });

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);

    this.trailLayer = createGraphics(canvas.x, canvas.y);

    this.maxHearts = 3;
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;
    this.resetting = false;
    this.flashTimer = 0;
    this.shakeTimer = 0;
    this.level = 1; 
    this.totalLevels = 3;
    
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  show() {

//image
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    image(mazebg, 0, 0, canvas.x, canvas.y);

    let shakeX = 0;
    let shakeY = 0;
//shake effect
    if (this.shakeTimer > 0) {
      shakeX = random(-2, 2);
      shakeY = random(-2, 2);
      this.shakeTimer--;
    }

    push();
    translate(shakeX, shakeY);

    fill(255, 255, 255, 250);
    rect(610, 110, 150, 40);


    push();
    imageMode(CENTER);
    imageMode(CENTER);

    

    //maze size
const mazeWidth = canvas.x * 0.4;
const mazeHeight = canvas.y * 0.55;

let currentMaze;
let goal;

// switch difficulty
switch (difficulty) {
  case 'easy':
    currentMaze = maze2;
      goal = { x: 495, y: 110 };
    
    break;
  case 'medium':
    currentMaze = maze1;
      goal = { x: 425, y: 100 };
 
    break;
  case 'hard':
    currentMaze = maze3;
      goal = { x: 800, y: 450 };
   
    break;
  default:
    currentMaze = maze2;
      goal = { x: 200, y: 100 };
    break;
}

image(currentMaze, canvas.x / 2, canvas.y / 2, mazeWidth, mazeHeight);
    pop();


    const mx = constrain(mouseX, 0, canvas.x - 1);
    const my = constrain(mouseY, 0, canvas.y - 1);
    const c = get(mx, my);


    const isWall = red(c) < 50 && green(c) < 50 && blue(c) < 50;


    if (isWall && mouseIsPressed && this.canLoseHeart && this.hearts > 0) {
      this.hearts -= 1;
      this.canLoseHeart = false;
      this.trailLayer.clear();


      this.flashTimer = 15;
      this.shakeTimer = 15;

      setTimeout(() => {
        this.canLoseHeart = true;
      }, 1000);
    }

    if (mouseIsPressed && this.hearts > 0) {
      this.trailLayer.noStroke();
      this.trailLayer.fill(isWall ? "red" : "orange");
      this.trailLayer.circle(mx, my, 15);
    }

    image(this.trailLayer, 0, 0);

fill(0, 255, 0, 180);
noStroke();
circle(goal.x, goal.y, 40);

let d = dist(mx, my, goal.x, goal.y);
if (d < 25 && mouseIsPressed && this.hearts > 0) {
  this.levelComplete(goal);
}


    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    this.displayHearts();


    if (this.flashTimer > 0) {
      push();
      noStroke();
      fill(255, 0, 0, map(this.flashTimer, 0, 15, 0, 180));
      rect(250, 250, 1000, 1000);
      pop();

      this.flashTimer--;
    }
  }
  

  displayHearts() {
    const heartSize = 40;
    for (let i = 0; i < this.maxHearts; i++) {
      const x = 540 + i * (heartSize + 10);
      const y = 90;
      if (i < this.hearts) {
        image(heart, x, y, heartSize, heartSize);
      } else {
        tint(255, 100);
        image(heart, x, y, heartSize, heartSize);
        noTint();
      }
    }
  }

}

