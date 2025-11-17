function displayStars({ total, remaining, starSize = 40, base_x = 540, base_y = 90 }) {
  for (let i = 0; i < total; i++) {
    const x = base_x + i * (starSize + 10);
    const y = base_y;

    const hovered = Math.abs(mouseX - x) < starSize / 2 && Math.abs(mouseY - y) < starSize / 2;

    push();
    translate(x, y);
    imageMode(CENTER);

    if (i < remaining) {
      if (hovered) {
        rotate(QUARTER_PI / 8);
      }
      image(star, 0, 0, starSize, starSize);
    } else {
      tint(255, 100);
      image(star, 0, 0, starSize, starSize);
    }

    pop();
  }
}
