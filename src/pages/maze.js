class MazePage extends Page {
  constructor() {
    super("maze");
    this.backButton = new BackButton();

    this.drawables.push(this.backButton);
    this.clickables.push(this.backButton);
    
    this.trailLayer = createGraphics(canvas.x, canvas.y);
   
    this.maxHearts = 3;
    this.hearts = this.maxHearts;
  }

  enter() {
    super.enter();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
  }

  show() {
  
  image(backgroundImg, 0, 0, canvas.x, canvas.y);
  image(mazebg, 0, 0, canvas.x, canvas.y);

  
  push();
  imageMode(CENTER);
  const mazeWidth = canvas.x * 0.4;
  const mazeHeight = canvas.y * 0.55;
  image(maze1, canvas.x / 2, canvas.y / 2, mazeWidth, mazeHeight);
  pop(); 

  
  const mx = constrain(mouseX, 0, canvas.x - 1);
  const my = constrain(mouseY, 0, canvas.y - 1);
  const c = get(mx, my);

 
  const isWall = red(c) < 50 && green(c) < 50 && blue(c) < 50;


  
if (isWall && mouseIsPressed) {
      if (this.hearts > 0) {
        this.hearts -= 1;
      }
      this.trailLayer.clear(); // optional reset
    }

  
  if (mouseIsPressed && this.hearts > 0) {
      this.trailLayer.noStroke();
      this.trailLayer.fill(isWall ? "red" : "orange");
      this.trailLayer.circle(mx, my, 15);
    }

image(this.trailLayer, 0, 0);




    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
     this.displayHearts();
  }

    displayHearts() {
    const heartSize = 40;
    for (let i = 0; i < this.maxHearts; i++) {
      const x = 40 + i * (heartSize + 10);
      const y = 40;
      if (i < this.hearts) {
        image(heart, x, y, heartSize, heartSize); // uses your global heart image
      } else {
        tint(255, 100); // faded hearty, heartSize, heartSize);
        noTint();
      }
    }
  }

}