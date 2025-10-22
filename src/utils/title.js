function drawGameTitle({
  title,
  bgColor = "#EAE4D8",
  widthOffset = 20,
  titleHeight = 60,
  yOffset = -10,
}) {
  // Draw banner shape
  fill(bgColor);
  stroke(0);
  strokeWeight(2);

  let x1 = canvas.q[0].x + widthOffset;
  let x2 = canvas.q[1].x - widthOffset;
  let yTop = canvas.q[0].y - titleHeight + yOffset;
  let yBottom = canvas.q[1].y + yOffset;
  let yMid = (yTop + yBottom) / 2;

  beginShape();
  vertex(x1 - titleHeight / 2, yMid);
  vertex(x1, yTop);
  vertex(x2, yTop);
  vertex(x2 + titleHeight / 2, yMid);
  vertex(x2, yBottom);
  vertex(x1, yBottom);
  endShape(CLOSE);

  noStroke();

  // Draw banner details
  fill(0);
  circle(x1, yMid, 7);
  circle(x2, yMid, 7);

  // Draw title text
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(title, canvas.m.x, yMid);
}