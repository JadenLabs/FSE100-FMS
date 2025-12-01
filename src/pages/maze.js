class MazePage extends Page {
  constructor() {
    super("maze");

    // ------------------------------------------------
    // 1. BACK BUTTON (Top Left)
    // ------------------------------------------------
    this.backButton = new BackButton();

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);

    // ------------------------------------------------
    // 2. GAME VARIABLES
    // ------------------------------------------------
    this.trailLayer = createGraphics(canvas.x, canvas.y);

    this.lastX = null;
    this.lastY = null;
    this.smoothX = null;
    this.smoothY = null;
    this.maxHearts = 3;
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;
    this.flashTimer = 0;
    this.shakeTimer = 0;
    this.level = 1;
    this.totalLevels = 3;
    this.inputLocked = true;
    this.showReward = false;
    this.showGameOver = false;
    this.randomDino = null;
    this.rewardScale = 0;
    this.confetti = [];
    this.started = false;

    // ---------------------------
    // Timer & Best Time (Feature)
    // ---------------------------
    // sanitized load of bestTimes per-level
    const _raw = JSON.parse(localStorage.getItem("maze_best_times") || "{}");
    this.bestTimes = {};
    for (let k in _raw) {
      const n = parseFloat(_raw[k]);
      if (!isNaN(n) && n > 0) this.bestTimes[k] = n;
    }

    this.levelStartTime = null;
    this.levelTime = 0;
    this.showHint = false;

    // HUD / animation state for new-best pulse (optional)
    this.showNewBest = false;
    this.newBestTimer = 0;
    this.newBestPulse = 1.0;

    // SOUND references (minimal additions)
    this.sfx_wallhit = (typeof sfx_wallhit !== 'undefined') ? sfx_wallhit : null;
    this.sfx_win = (typeof sfx_win !== 'undefined') ? sfx_win : null;
    this.sfx_lose = (typeof sfx_lose !== 'undefined') ? sfx_lose : null;
    this.sfx_spark = (typeof sfx_spark !== 'undefined') ? sfx_spark : null; // <--- spark sound

    // internal one-shot flag for lose sound (reset in resetLevel)
    this._playedLose = false;

    // internal flag to avoid repeatedly calling play()
    this._playingSpark = false;
  }

  enter() {
    super.enter();
    // keep internal level in sync with difficulty string
    this.level = this.difficultyToLevel();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    this.resetLevel(); // Always start fresh
  }

  // ------------------------------------------------
  // HELPER: Reset the current game state
  // ------------------------------------------------
  resetLevel() {
    this.started = false;
    this.hearts = this.maxHearts;
    this.canLoseHeart = true;
    this.showReward = false;
    this.showGameOver = false;
    this.rewardScale = 0;
    this.trailLayer.clear();
    this.inputLocked = true;
    this.lastX = null;
    this.lastY = null;
    this.smoothX = null;
    this.smoothY = null;
    this.levelStartTime = null;
    this.levelTime = 0;

    // reset lose-play flag so sound can play on next game-over
    this._playedLose = false;

    // stop spark if it was playing
    if (this.sfx_spark && this._playingSpark) {
      try { if (this.sfx_spark.isPlaying && this.sfx_spark.isPlaying()) this.sfx_spark.stop(); } catch(e) {}
      this._playingSpark = false;
    }
  }

  // ------------------------------------------------
  // Best-time helpers (per level)
  // ------------------------------------------------
  getBestTime(levelNum) {
    const key = `level_${levelNum}`;
    return this.bestTimes.hasOwnProperty(key) ? this.bestTimes[key] : null;
  }

  setBestTime(levelNum, timeSec) {
    if (!timeSec || typeof timeSec !== "number" || timeSec <= 0) return;
    const key = `level_${levelNum}`;
    this.bestTimes[key] = timeSec;
    localStorage.setItem("maze_best_times", JSON.stringify(this.bestTimes));
  }

  resetBestTimes(levelNum = null) {
    if (levelNum == null) {
      this.bestTimes = {};
    } else {
      const key = `level_${levelNum}`;
      delete this.bestTimes[key];
    }
    localStorage.setItem("maze_best_times", JSON.stringify(this.bestTimes));
  }

  // ------------------------------------------------
  // Convert difficulty string -> canonical level index
  // ------------------------------------------------
  difficultyToLevel() {
    switch (difficulty) {
      case "easy": return 1;
      case "medium": return 2;
      case "hard": return 3;
      default: return this.level || 1;
    }
  }

  // ------------------------------------------------
  // HELPER: Advance level
  // ------------------------------------------------
  nextLevel() {
    this.level++;
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
  // ------------------------------------------------
  drawPopupBtn(label, x, y, w, h, btnColor) {
    let clicked = false;

    let globalX = (canvas.x / 2) + x;
    let globalY = (canvas.y / 2) + y;

    // Check collision with mouse
    let isHovering = (mouseX > globalX - w/2 && mouseX < globalX + w/2 &&
      mouseY > globalY - h/2 && mouseY < globalY + h/2);

    push();
    rectMode(CENTER);

    if (isHovering) {
      fill(lerpColor(color(btnColor), color(0), 0.2));
      cursor(HAND);
    } else {
      fill(btnColor);
      cursor(ARROW);
    }

    stroke(255);
    strokeWeight(3);
    rect(x, y, w, h, 10);

    // Button Text
    fill(255);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(label, x, y);
    pop();

    // Check for Click
    if (isHovering && mouseIsPressed && !this.inputLocked) {
      clicked = true;
      this.inputLocked = true;
    }

    return clicked;
  }

  // ------------------------------------------------
  // MAIN DRAW LOOP
  // ------------------------------------------------
  show() {
    // 1. INPUT LOCK LOGIC
    if (this.inputLocked) {
      if (!mouseIsPressed) {
        this.inputLocked = false;
      }
    }

    // central tick for new-best timer
    if (this.newBestTimer > 0) this.newBestTimer--;

    // 2. CHECK POPUPS
    if (this.showReward) {
      this.drawWinPopup();
      return;
    }

    if (this.showGameOver) {
      this.drawGameOverPopup();
      return;
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
    let start;

    // Pick maze based on difficulty
    switch (difficulty) {
      case 'easy':
        currentMaze = maze1;
        goal = { x: 457, y: 115};
        start = { x: 278, y: 255 };
        break;
      case 'medium':
        currentMaze = maze2;
        goal = { x: 500, y: 140 };
        start = { x: 270, y: 250 };
        break;
      case 'hard':
        currentMaze = maze3;
        goal = { x: 335, y: 80};
        start = { x: 335, y: 270 };
        break;
      default:
        currentMaze = maze2;
        goal = { x: 200, y: 100 };
        start = { x: 300, y: 350 };
        break;
    }
    image(currentMaze, canvas.x / 2, canvas.y / 2, mazeWidth, mazeHeight);
    pop();

    // 6. WALL COLLISION LOGIC
    const mx = constrain(mouseX, 0, canvas.x - 1);
    const my = constrain(mouseY, 0, canvas.y - 1);

    let hitWall = false;
    let pointsToCheck = [{x: mx, y: my}];

    if (this.started && this.lastX != null && this.lastY != null) {
      let d = dist(this.lastX, this.lastY, mx, my);
      if (d > 5) {
        let steps = d / 4;
        for (let i = 1; i < steps; i++) {
          pointsToCheck.push({
            x: lerp(this.lastX, mx, i/steps),
            y: lerp(this.lastY, my, i/steps)
          });
        }
      }
    }

    for (let pt of pointsToCheck) {
      const c = get(pt.x, pt.y);
      if (red(c) < 100 && green(c) < 100 && blue(c) < 100) {
        hitWall = true;
        break;
      }
    }

    // Apply collision results
    if (hitWall && mouseIsPressed && this.canLoseHeart && this.hearts > 0 && !this.inputLocked && this.started) {
      this.hearts--;

      // play wall hit sound (existing)
      if (this.sfx_wallhit) this.sfx_wallhit.play();

      this.started = false;
      this.levelStartTime = null;
      if (this.hearts <= 0) {
        this.showGameOver = true;
        this.inputLocked = true;
        this.rewardScale = 0;
        return;
      }

      this.canLoseHeart = false;
      this.trailLayer.clear();
      this.flashTimer = 15;
      this.shakeTimer = 15;
      setTimeout(() => { this.canLoseHeart = true; }, 1000);
    }

    // 7. DRAWING THE TRAIL
    if (mouseIsPressed && this.hearts > 0 && !this.inputLocked && this.started) {
      if (this.smoothX === null) {
        this.smoothX = mx; this.smoothY = my;
        this.lastX = mx; this.lastY = my;
      }

      this.smoothX = lerp(this.smoothX, mx, 0.18);
      this.smoothY = lerp(this.smoothY, my, 0.18);

      this.trailLayer.stroke(hitWall ? "red" : "orange");
      this.trailLayer.strokeWeight(12);
      this.trailLayer.strokeCap(ROUND);

      if (this.lastX !== null) {
        this.trailLayer.line(this.lastX, this.lastY, this.smoothX, this.smoothY);
      }

      this.lastX = this.smoothX;
      this.lastY = this.smoothY;

      // --- START/CONTINUE spark sound while drawing ---
      if (this.sfx_spark && !this._playingSpark) {
        try {
          // short spark: start playing (if it's a looping spark you might want playMode or loop;
          // here we call play() and mark flag so it doesn't spam)
          this.sfx_spark.play();
          this._playingSpark = true;
        } catch (e) {
          // ignore playback errors
        }
      }
    } else {
      // stop spark if it was playing and drawing has stopped
      if (this.sfx_spark && this._playingSpark) {
        try { if (this.sfx_spark.isPlaying && this.sfx_spark.isPlaying()) this.sfx_spark.stop(); } catch(e) {}
        this._playingSpark = false;
      }

      this.lastX = null; this.lastY = null;
      this.smoothX = null; this.smoothY = null;
    }

    image(this.trailLayer, 0, 0);

    // 8. CHECK GOAL & START LOGIC
    push();
    imageMode(CENTER);

    // --- START BUTTON (EGG) ---
    image(egg3, start.x, start.y, 30, 35);

    let distStart = dist(mx, my, start.x, start.y);

    // STARTING: If not started, press start to begin
    if (!this.started && mouseIsPressed && distStart < 20) {
      this.started = true;
      this.trailLayer.clear();
      // start timer
      this.levelStartTime = millis();
    }

    // --- LIFT-OFF PENALTY ---
    if (this.started && !mouseIsPressed) {
      this.hearts--;
      this.started = false; // Stop the run
      this.trailLayer.clear(); // Clear the trail

      // stop timer because run ended/failed
      this.levelStartTime = null;

      this.flashTimer = 15;
      this.shakeTimer = 15;

      if (this.hearts <= 0) {
        this.showGameOver = true;
        this.inputLocked = true;
        this.rewardScale = 0;
      }
    }

    // --- GOAL AREA ---
    if (this.started) fill(0, 170, 255, 160);
    else fill(135, 206, 235, 160);
    circle(goal.x, goal.y, 30);

    let distGoal = dist(mx, my, goal.x, goal.y);

    // Win only if started and pressing
    if (this.started && mouseIsPressed && distGoal < 15 && this.hearts > 0) {
      this.levelComplete();
    }

    pop();

    // 9. UI ELEMENTS
    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    this.displayHearts();

    // draw timer HUD (current run + best)
    this.drawTimerHUD();

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

    pop(); // end translate(shakeX,shakeY)
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

  drawTimerHUD() {
    push();
    textAlign(LEFT, CENTER);
    textSize(18);
    fill(255);

    // Current run time (live)
    let current = "--";
    let running = false;
    if (this.levelStartTime) {
      let curSecs = (millis() - this.levelStartTime) / 1000;
      current = nf(curSecs, 0, 2) + "s";
      running = true;
    } else if (this.levelTime && this.levelTime > 0) {
      current = nf(this.levelTime, 0, 2) + "s"; // last run
    }

    // Best time for this difficulty (map difficulty -> level index)
    const bestLevel = this.difficultyToLevel();
    let key = `level_${bestLevel}`;
    let best = this.bestTimes[key] ? nf(this.bestTimes[key], 0, 2) + "s" : "--";

    // Position (tweak coordinates as you like)
    let x = 30;
    let y = 40;

    // Background pill
    noStroke();
    fill(255, 255, 255, 204);
    rect(x + 75, y + 60, 150, 80, 18);

    // Labels
    fill(0);
    textStyle(BOLD);
    text("Time:", x+10, y +40 );
    text("Best:", x+10, y + 80);

    // Values
    fill(0, 170, 255);
    textAlign(RIGHT, CENTER);
    text(current, x + 130, y+40);
    text(best, x + 130, y + 80);

    pop();
  }

  levelComplete() {
    // compute final time (seconds)
    if (this.levelStartTime) {
      this.levelTime = (millis() - this.levelStartTime) / 1000;
    } else {
      this.levelTime = 0;
    }
    this.levelStartTime = null; // stop timer

    // play win sound (minimal addition)
    if (this.sfx_win) this.sfx_win.play();

    // store best time for the current difficulty (mapped consistently)
    const bestLevel = this.difficultyToLevel();
    let key = `level_${bestLevel}`;
    if (!this.bestTimes[key] || (this.levelTime > 0 && this.levelTime < this.bestTimes[key])) {
      this.bestTimes[key] = this.levelTime;
      localStorage.setItem("maze_best_times", JSON.stringify(this.bestTimes));
    }

    this.showReward = true;
    this.inputLocked = true;
    this.rewardScale = 0;
    this.confetti = [];
    this.randomDino = random([dinoGif, dinoGif2, dinoGif3]);
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
    fill("#0392e5ff");
    textSize(35);
    textStyle(BOLD);
    text("Great Job!", 0, -120);
    imageMode(CENTER);
    image(this.randomDino, 0, -20, 280, 160);

    // Show time & best time in popup (use difficulty mapping)
    fill(70);
    textStyle(BOLD);
    textSize(25);
    textAlign(CENTER, CENTER);
    let last = this.levelTime > 0 ? nf(this.levelTime, 0, 2) + "s" : "--";
    const bestLevel = this.difficultyToLevel();
    let best = this.bestTimes[`level_${bestLevel}`] ? nf(this.bestTimes[`level_${bestLevel}`], 0, 2) + "s" : "--";
    text(`Time: ${last}   Best: ${best}`, 0, 70);

    // --- BUTTONS ---

    // 1. Home (Blue)
    if (this.drawPopupBtn("Home", -150, 125, 100, 50, "#4a90e2")) {
      this.resetLevel();
      changePage("main");
    }

    // 2. Again (Orange)
    if (this.drawPopupBtn("Again", 0, 125, 100, 50, "#f5a623")) {
      this.resetLevel();
    }

    // 3. Next (Green)
    if (this.drawPopupBtn("Next", 150, 125, 100, 50, "#69b01cff")) {
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
    // Play lose sound once when the popup first appears
    if (this.sfx_lose && !this._playedLose) {
      try { this.sfx_lose.play(); } catch(e) { /* ignore playback errors */ }
      this._playedLose = true;
    }

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
    image(dinolose, 0, 0, 350, 230);

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
