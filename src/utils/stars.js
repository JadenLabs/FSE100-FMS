let _star_theta = 0;

function displayStars({ total, remaining, starSize = 40, base_x = 540, base_y = 90 }) {
  for (let i = 0; i < total; i++) {
    const x = base_x + i * (starSize + 10);
    const y = base_y;

    push();
    translate(x, y);
    imageMode(CENTER);

    if (i < remaining) {
        rotate(starsAnimation());
      image(star, 0, 0, starSize, starSize);
    } else {
      tint(255, 100);
      image(star, 0, 0, starSize, starSize);
    }

    pop();
  }
  _star_theta += deltaTime;
}

function starsAnimation() {
  let angle = (Math.PI / 2) * Math.sin(_star_theta / 500);
  return angle;
}