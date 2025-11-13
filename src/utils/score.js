function displayScore({ score, scoreText="Score: ", x=canvas.q[0].x - 25, y=canvas.q[0].y - 50 }) {
    fill(255);
    textSize(32);
    stroke(0);
    text(scoreText + score, x, y);
}