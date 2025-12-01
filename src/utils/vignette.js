/*
    Start: rbga of the edge
    End: rbga of the center
*/
function drawVignette(start, stop) {
  push();
  drawingContext.save();

  const w = width;
  const h = height;

  let gradient = drawingContext.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    max(w, h) / 1.4
  );

  startFmt = `rgba(${start[0]}, ${start[1]}, ${start[2]}, ${start[3]})`;
  stopFmt = `rgba(${stop[0]}, ${stop[1]}, ${stop[2]}, ${stop[3]})`;

  gradient.addColorStop(0, startFmt);
  gradient.addColorStop(1, stopFmt);

  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, w, h);

  drawingContext.restore();
  pop();
}
