class MazePage extends Page {
  constructor() {
    super("maze");

    // ------------------------------------------------
    // 1. BACK BUTTON (Top Left)
    // ------------------------------------------------
    this.backButton = new BackButton({
      x: 40,
      y: 30,
      h: 45,
      w: 45,
      onClick: () => {
        this.resetLevel();
        changePage("main");
      },
    });

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);

    // ------------------------------------------------
    // 2. GAME VARIABLES
    // ------------------------------------------------
    this.trailLayer = createGraphics(canvas.x, canvas.y);
    
    // Trail smoothing variables
    this.lastX = null;
    this.lastY = null;
    this.smoothX = null;
    this.smoothY = null;
    
    // Health
    this.maxHearts = 3;
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;

    // Timers and Counters
    this.flashTimer = 0;
    this.shakeTimer = 0;
    this.level = 1;
    this.totalLevels = 3;
    
    // State Flags
    this.inputLocked = true; 
    this.showReward = false;
    this.showGameOver = false;
    
    // Animation
    this.rewardScale = 0;
    this.confetti = [];
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    this.resetLevel(); // Always start fresh
  }

  // ------------------------------------------------
  // HELPER: Reset the current game state
  // ------------------------------------------------
  resetLevel() {
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;
    this.showReward = false;
    this.showGameOver = false;
    this.rewardScale = 0;
    this.trailLayer.clear();
    this.inputLocked = true; // Require click release
    
    this.lastX = null;
    this.lastY = null;
    this.smoothX = null;
    this.smoothY = null;
  }

  // ------------------------------------------------
  // HELPER: Advance level
  // ------------------------------------------------
  nextLevel() {
    this.level++;
    // Loop back to 1 if we pass the max levels
    if (this.level > this.totalLevels) {
        this.level = 1; 
    }
    
    // Update global difficulty based on level
    if (this.level === 1) difficulty = "easy";
    if (this.level === 2) difficulty = "medium";
    if (this.level === 3) difficulty = "hard";
    
    this.resetLevel();
  }

  // ------------------------------------------------
  // HELPER: Draw a button inside a popup
  // Returns TRUE if clicked
  // ------------------------------------------------
  drawPopupBtn(label, x, y, w, h, btnColor) {
    let clicked = false;
    
    // Calculate global coordinates because we are inside a translate()
    // The popup is centered at (canvas.x/2, canvas.y/2)
    let globalX = (canvas.x / 2) + x;
    let globalY = (canvas.y / 2) + y;
    
    // Check collision with mouse
    let isHovering = (mouseX > globalX - w/2 && mouseX < globalX + w/2 &&
                      mouseY > globalY - h/2 && mouseY < globalY + h/2);

    push();
    rectMode(CENTER);
    
    // Darken color on hover
    if (isHovering) {
        fill(lerpColor(color(btnColor), color(0), 0.2));
        cursor(HAND); // Change cursor to hand
    } else {
        fill(btnColor);
        cursor(ARROW);
    }
    
    stroke(255);
    strokeWeight(3);
    rect(x, y, w, h, 10); // Button shape

    // Button Text
    fill(255);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(label, x, y);
    pop();

    // Check for Click
    // !this.inputLocked prevents clicking the moment the popup appears
    if (isHovering && mouseIsPressed && !this.inputLocked) {
        clicked = true;
        this.inputLocked = true; // Lock input to prevent double-clicks
    }
    
    return clicked;
  }

  // ------------------------------------------------
  // MAIN DRAW LOOP
  // ------------------------------------------------
  show() {
    
    // 1. INPUT LOCK LOGIC (MOVED TO TOP)
    // This must run BEFORE popups return, or buttons will never unlock
    if (this.inputLocked) {
      if (!mouseIsPressed) {
        this.inputLocked = false;
      }
    }

    // 2. CHECK POPUPS
    if (this.showReward) {
      this.drawWinPopup();
      return; // Stop drawing the game if popup is open
    }

    if (this.showGameOver) {
      this.drawGameOverPopup();
      return; // Stop drawing the game if popup is open
    }

    // 3. BACKGROUND
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    image(mazebg, 0, 0, canvas.x, canvas.y);

    // 4. SHAKE EFFECT
    let shakeX = 0, shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeX = random(-5, 5);
      shakeY = random(-5, 5);
      this.shakeTimer--;
    }
    push();
    translate(shakeX, shakeY);

    // 5. DRAW MAZE
    push();
    imageMode(CENTER);
    const mazeWidth = canvas.x * 0.48;
    const mazeHeight = canvas.y * 0.63;
    
    let currentMaze;
    let goal;

    // Pick maze based on difficulty
    switch (difficulty) {
      case 'easy':
        currentMaze = maze3;
        goal = { x: 495, y: 150 };
        break;
      case 'medium':
        currentMaze = maze2;
        goal = { x: 500, y: 140 };
        break;
      case 'hard':
        currentMaze = maze2;
        goal = { x: 800, y: 450 };
        break;
      default:
        currentMaze = maze2;
        goal = { x: 200, y: 100 };
        break;
    }
    image(currentMaze, canvas.x / 2, canvas.y / 2, mazeWidth, mazeHeight);
    pop();

    // 6. WALL COLLISION LOGIC
    const mx = constrain(mouseX, 0, canvas.x - 1);
    const my = constrain(mouseY, 0, canvas.y - 1);
    const c = get(mx, my);
    
    // Check if pixel is dark (wall)
    const isWall = red(c) < 100 && green(c) < 100 && blue(c) < 100;

    if (isWall && mouseIsPressed && this.canLoseHeart && this.hearts > 0 && !this.inputLocked) {
      this.hearts--;
      
      if (this.hearts <= 0) {
        this.showGameOver = true;
        this.inputLocked = true; // Stop drawing immediately
        this.rewardScale = 0;
        return;
      }

      this.canLoseHeart = false;
      this.trailLayer.clear(); // Reset line
      this.flashTimer = 15;
      this.shakeTimer = 15;
      setTimeout(() => { this.canLoseHeart = true; }, 1000);
    }

    // 7. DRAWING THE TRAIL
    if (mouseIsPressed && this.hearts > 0 && !this.inputLocked) {
      if (this.smoothX === null) {
        this.smoothX = mx; this.smoothY = my;
        this.lastX = mx; this.lastY = my;
      }
      
      // Smooth mouse movement
      this.smoothX = lerp(this.smoothX, mx, 0.25); 
      this.smoothY = lerp(this.smoothY, my, 0.25);

      this.trailLayer.stroke(isWall ? "red" : "orange");
      this.trailLayer.strokeWeight(12);
      this.trailLayer.strokeCap(ROUND);

      if (this.lastX !== null) {
        this.trailLayer.line(this.lastX, this.lastY, this.smoothX, this.smoothY);
      }

      this.lastX = this.smoothX;
      this.lastY = this.smoothY;
    } else {
      this.lastX = null; this.lastY = null;
      this.smoothX = null; this.smoothY = null;
    }

    image(this.trailLayer, 0, 0);

    // 8. CHECK GOAL
    noStroke();
    // Debug goal circle (optional, can remove fill if invisible)
    fill(0, 255, 0, 50); 
    circle(goal.x, goal.y, 40);

    let d = dist(mx, my, goal.x, goal.y);
    if (d < 30 && mouseIsPressed && this.hearts > 0) {
      this.levelComplete();
    }

    pop(); // End Shake

    // 9. UI ELEMENTS
    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    this.displayHearts();

    // 10. FLASH RED EFFECT
    if (this.flashTimer > 0) {
      push();
      noStroke();
      fill(255, 0, 0, map(this.flashTimer, 0, 15, 0, 100));
      rectMode(CORNER);
      rect(0, 0, canvas.x, canvas.y);
      pop();
      this.flashTimer--;
    }
  }

  // ------------------------------------------------
  // UI RENDERERS
  // ------------------------------------------------
  displayHearts() {
    const eggWidth = 50;
    const eggHeight = 60;
    for (let i = 0; i < this.maxHearts; i++) {
      const x = 275 + i * (eggWidth + 10);
      const y = 295;
      image(i < this.hearts ? egg2 : eggCracked, x, y, eggWidth, eggHeight);
    }
  }

  levelComplete() {
    this.showReward = true;
    this.inputLocked = true;
    this.rewardScale = 0;
    this.confetti = [];
    for (let i = 0; i < 50; i++) {
      this.confetti.push({
        x: random(canvas.x),
        y: random(-200, -50),
        size: random(8, 15),
        speed: random(3, 7),
        color: color(random(100, 255), random(100, 255), random(100, 255))
      });
    }
  }

  // ------------------------------------------------
  // POPUP DRAWER: WIN
  // ------------------------------------------------
  drawWinPopup() {
    // Darken background
    push();
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    image(mazebg, 0, 0, canvas.x, canvas.y);
    rectMode(CENTER);
    fill(0, 0, 0, 150);
    rect(canvas.x / 2, canvas.y / 2, canvas.x, canvas.y);
    pop();

    this.rewardScale = lerp(this.rewardScale, 1, 0.15);

    push();
    translate(canvas.x / 2, canvas.y / 2);
    scale(this.rewardScale);

    // Panel
    push();
    fill(255, 255, 255, 240);
    stroke(255);
    strokeWeight(4);
    rect(0, 0, 500, 350, 30);
    pop();

    // Text & Dino
    fill(0);
    textSize(35);
    text("Great Job!", 0, -120);
    imageMode(CENTER);
    image(dinoGif, 0, -20, 280, 160); 

    // --- BUTTONS ---
    
    // 1. Home (Blue)
    if (this.drawPopupBtn("Home", -150, 100, 100, 50, "#4a90e2")) {
        this.resetLevel();
        changePage("main");
    }

    // 2. Again (Orange)
    if (this.drawPopupBtn("Again", 0, 100, 100, 50, "#f5a623")) {
        this.resetLevel();
    }

    // 3. Next (Green)
    if (this.drawPopupBtn("Next", 150, 100, 100, 50, "#7ed321")) {
        this.nextLevel();
    }

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
  }

  // ------------------------------------------------
  // POPUP DRAWER: GAME OVER
  // ------------------------------------------------
  drawGameOverPopup() {
    // Darken Background (Red Tint)
    push();
    image(backgroundImg, 0, 0, canvas.x, canvas.y);
    image(mazebg, 0, 0, canvas.x, canvas.y);
    rectMode(CENTER);
    fill(50, 0, 0, 150); 
    rect(canvas.x / 2, canvas.y / 2, canvas.x, canvas.y);
    pop();

    this.rewardScale = lerp(this.rewardScale, 1, 0.15);

    push();
    translate(canvas.x / 2, canvas.y / 2);
    scale(this.rewardScale);

    // Panel
    push();
    fill(255, 255, 255, 240);
    stroke(255, 100, 100);
    strokeWeight(4);
    rect(0, 0, 500, 350, 30);
    pop();

    // Text & Dino
    fill(200, 50, 50);
    textSize(40);
    textStyle(BOLD);
    text("Oh No!", 0, -110);
    imageMode(CENTER);
    image(dinoGif2, 0, 0, 260, 150);

    // --- BUTTONS ---

    // 1. Home (Blue)
    if (this.drawPopupBtn("Home", -80, 120, 120, 55, "#4a90e2")) {
        this.resetLevel();
        changePage("main");
    }

    // 2. Try Again (Orange)
    if (this.drawPopupBtn("Retry", 80, 120, 120, 55, "#f5a623")) {
        this.resetLevel();
    }

    pop();
  }
}