const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 10 * Math.PI / 30;
const r = 50;

function init() {
init();
drawGrid(canvas.width, canvas.height);
}
init();

function drawGrid(width, height) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
  for (let yi = r, j = 0; yi + r * Math.sin(a) < canvas.height - 20; yi += 2 ** ((j + 1) % 2) * r * Math.sin(a), j = 0) {
    for (let xi = r; xi + r * (1 + Math.cos(a)) < canvas.width - 20; xi += r * (1 + Math.cos(a)), yi += (-1) ** j++ * r * Math.sin(a)) {
      if (isPointInHexagon(x, y, xi, yi)) {
        drawHexagon(xi, yi, true);
      } else {
        drawHexagon(xi, yi, false);
      }
    }
  }
};


canvas.addEventListener('mousemove', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(canvas.width - 20, canvas.height - 20);
  
  for (let yi = r, j = 0; yi + r * Math.sin(a) < canvas.height - 20; yi += 2 ** ((j + 1) % 2) * r * Math.sin(a), j = 0) {
    for (let xi = r; xi + r * (1 + Math.cos(a)) < canvas.width - 20; xi += r * (1 + Math.cos(a)), yi += (-1) ** j++ * r * Math.sin(a)) {
      if (isPointInHexagon(x, y, xi, yi)) {
        drawHexagon(xi, yi, true);
      } else {
        drawHexagon(xi, yi, false);
      }
    }
  }
});

function isPointInHexagon(x, y, hx, hy) {
  const dx = x - hx;
  const dy = y - hy;
  return Math.abs(dx / Math.cos(a)) + Math.abs(dy / Math.sin(a)) <= r;
}

function drawHexagon(x, y, highlighted) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  if (highlighted) {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fill();
  }
  ctx.stroke();
}

