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

  
 if (isWall && mouseIsPressed && this.canLoseHeart && this.hearts > 0) {
      this.hearts -= 1;
      this.canLoseHeart = false;
      this.trailLayer.clear();

      
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




    drawGameTitle({ title: "Maze", widthOffset: 90, yOffset: -20 });
    this.backButton.show();
    displayHearts({total: this.maxHearts, remaining: this.hearts});
  }
}

