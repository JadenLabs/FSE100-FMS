function displayHearts({total, remaining, heartSize = 40, base_x = 540, base_y = 90}) {
  for (let i = 0; i < total; i++) {
    const x = base_x + i * (heartSize);
    const y = base_y;
    if (i < remaining) {
      image(heart, x, y, heartSize, heartSize);
    } else {
      tint(255, 100);
      image(heart, x, y, heartSize, heartSize);
      noTint();
    }
  }
}
