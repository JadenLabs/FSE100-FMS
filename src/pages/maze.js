class MazePage extends Page {
  constructor() {
    super("maze");

    // Back Button
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

    // Gameplay Variables
    this.trailLayer = createGraphics(canvas.x, canvas.y);
    this.maxHearts = 3;
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;

    this.resetting = false;
    this.flashTimer = 0;
    this.shakeTimer = 0;
    this.level = 1;
    this.totalLevels = 3;
    this.inputLocked = true;

    // Popups
    this.showReward = false;
    this.rewardScale = 0;
    this.gameOverScale = 0;
    this.confetti = [];
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    this.inputLocked = true;
  }

  show() {

    //-----------------------------------------
    // WIN POPUP
    //-----------------------------------------
    if (this.showReward) {

      image(backgroundImg, 0, 0, canvas.x, canvas.y);
      image(mazebg, 0, 0, canvas.x, canvas.y);

      // Dim
      push();
      rectMode(CENTER);
      fill(0, 0, 0, 120);
      rect(canvas.x / 2, canvas.y / 2, 800, 800);
      pop();

      // Scale animation
      this.rewardScale = lerp(this.rewardScale, 1, 0.15);

      // Panel
      push();
      translate(canvas.x / 2, canvas.y / 2);
      scale(this.rewardScale);

      push();
      fill(255, 255, 255, 220);
      stroke(255, 255, 255, 150);
      strokeWeight(3);
      rect(0, 0, 450, 320, 25);

      noStroke();
      fill(255, 255, 255, 100);
      rect(0, -40, 340, 15, 10);
      pop();

      imageMode(CENTER);
      image(dinoGif, 0, 0, 360, 210);
      pop();

      // Confetti
      for (let c of this.confetti) {
        fill(c.color);
        noStroke();
        circle(c.x, c.y, c.size);

        c.y += c.speed;
        if (c.y > canvas.y + 20) {
          c.y = random(-100, -20);
          c.x = random(canvas.x);
        }
      }

      return;
    }

    //-----------------------------------------
    // GAME OVER POPUP
    //-----------------------------------------
    if (this.showGameOver) {

      image(backgroundImg, 0, 0, canvas.x, canvas.y);
      image(mazebg, 0, 0, canvas.x, canvas.y);

      this.rewardScale = lerp(this.rewardScale, 1, 0.15);

      push();
      translate(canvas.x / 2, canvas.y / 2);
      scale(this.rewardScale);

      push();
      fill(255, 255, 255, 220);
      stroke(255, 255, 255, 150);
      strokeWeight(3);
      rect(0, 0, 450, 320, 25);

      noStroke();
      fill(255, 255, 255, 100);
      rect(0, -40, 340, 15, 10);
      pop();

      textSize(50);
      textStyle(BOLD);
      fill(255, 0, 0);
      text("Try Again!", 0, -100);

      imageMode(CENTER);
      image(dinoGif2, 0, 0, 360, 210);

      pop();

      return;
    }

    //-----------------------------------------
    // INPUT LOCK AT START
    //-----------------------------------------
    if (this.inputLocked) {
      if (!mouseIsPressed) {
        this.inputLocked = false;
      }
      return;
    }

    //-----------------------------------------
    // BACKGROUND
    //-----------------------------------------
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    image(mazebg, 0, 0, canvas.x, canvas.y);

    //-----------------------------------------
    // SHAKE EFFECT
    //-----------------------------------------
    let shakeX = 0, shakeY = 0;

    if (this.shakeTimer > 0) {
      shakeX = random(-2, 2);
      shakeY = random(-2, 2);
      this.shakeTimer--;
    }

    push();
    translate(shakeX, shakeY);

    //-----------------------------------------
    // MAZE SETUP
    //-----------------------------------------
    push();
    imageMode(CENTER);

    const mazeWidth = canvas.x * 0.4;
    const mazeHeight = canvas.y * 0.55;

    let currentMaze;
    let goal;

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
    pop(); // end maze push

    //-----------------------------------------
    // WALL COLLISION
    //-----------------------------------------
    const mx = constrain(mouseX, 0, canvas.x - 1);
    const my = constrain(mouseY, 0, canvas.y - 1);
    const c = get(mx, my);

    const isWall = red(c) < 50 && green(c) < 50 && blue(c) < 50;

    if (isWall && mouseIsPressed && this.canLoseHeart && this.hearts > 0) {
      this.hearts--;

      if (this.hearts <= 0) {
        this.showGameOver = true;
        this.rewardScale = 0;
        return;
      }

      this.canLoseHeart = false;
      this.trailLayer.clear();

      this.flashTimer = 15;
      this.shakeTimer = 15;

      setTimeout(() => {
        this.canLoseHeart = true;
      }, 1000);
    }

    //-----------------------------------------
    // DRAW TRAIL
    //-----------------------------------------
    if (mouseIsPressed && this.hearts > 0) {
      this.trailLayer.noStroke();
      this.trailLayer.fill(isWall ? "red" : "orange");
      this.trailLayer.circle(mx, my, 15);
    }

    image(this.trailLayer, 0, 0);

    //-----------------------------------------
    // GOAL
    //-----------------------------------------
    noFill();
    noStroke();
    circle(goal.x, goal.y, 40);

    let d = dist(mx, my, goal.x, goal.y);

    if (d < 25 && mouseIsPressed && this.hearts > 0) {
      this.levelComplete();
    }

    pop(); // end shake

    //-----------------------------------------
    // UI
    //-----------------------------------------
    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    this.displayHearts();

    //-----------------------------------------
    // FLASH RED
    //-----------------------------------------
    if (this.flashTimer > 0) {
      push();
      noStroke();
      fill(255, 0, 0, map(this.flashTimer, 0, 15, 0, 180));
      rect(250, 250, 1000, 1000);
      pop();
      this.flashTimer--;
    }
  }

  //---------------------------------------------------------------
  // HEART DISPLAY
  //---------------------------------------------------------------
  displayHearts() {
    const eggWidth = 50;
    const eggHeight = 60;

    for (let i = 0; i < this.maxHearts; i++) {
      const x = 275 + i * (eggWidth + 2);
      const y = 295;
      image(i < this.hearts ? egg2 : eggCracked, x, y, eggWidth, eggHeight);
    }
  }

  //---------------------------------------------------------------
  // LEVEL COMPLETE
  //---------------------------------------------------------------
  levelComplete() {
    this.showReward = true;
    this.rewardScale = 0;

    this.confetti = [];

    for (let i = 0; i < 40; i++) {
      this.confetti.push({
        x: random(canvas.x),
        y: random(-200, 0),
        size: random(5, 10),
        speed: random(2, 4),
        color: color(random(100, 255), random(100, 255), random(100, 255))
      });
    }
  }
}

