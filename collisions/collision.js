const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
canvas.width = 500;
canvas.height = 500;

const canvas_background = "white";
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const mousePoint = {
  x: 0,
  y: 0
}

const mouseRectangle = {
  x: 0,
  y: 0,
  w: 30,
  h: 30,
  color: "#808080b0"
}

const mouseCircle = {
  x: 0,
  y: 0,
  r: 50,
  color: "#808080b0"
}

const centerCircle = {
  x: centerX,
  y: centerY,
  r: 90,
  color: "#007cff"
}

const centerRectangle = {
  x: centerX - 75,
  y: centerY - 75,
  w: 150,
  h: 150,
  color: "#007cff"
}

function updateRectanglePoint() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerRectangle.color = checkPointRectangleCollision(mousePoint, centerRectangle) ? "orange" : "#007cff"

  drawRectangle(centerRectangle);
  drawPoint(mousePoint);
}

function updateRectangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerRectangle.color = checkRectanglesCollision(mouseRectangle, centerRectangle) ? "orange" : "#007cff"

  drawRectangle(centerRectangle);
  drawRectangle(mouseRectangle);
}

function updateCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerCircle.color = "#007cff";
  if (checkCircleCollision(centerCircle, mouseCircle))
    centerCircle.color = "orange";

  drawCircle(centerCircle);
  drawCircle(mouseCircle);
}

function updateCircleRectangle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerRectangle.color = checkCircleRectangleCollision(mouseCircle, centerRectangle) ? "orange" : "#007cff"

  drawRectangle(centerRectangle);
  drawCircle(mouseCircle);
}

function drawPoint({ x, y }) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawCircle({ x, y, r, color }) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill();
}

function drawRectangle({ x, y, w, h, color }) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fill();
}

function checkCircleCollision(circle1, circle2) {
  const distX = circle1.x - circle2.x;
  const distY = circle1.y - circle2.y;
  const distance = Math.sqrt((distX * distX) + (distY * distY));

  return distance <= (circle1.r + circle2.r);
}

function getRectangleEdges({ x, y, w, h }) {
  return {
    leftEdge: x,
    rightEdge: x + w,
    topEdge: y,
    bottomEdge: y + h
  }
}

// function getRectangleVertices({ x, y, w, h }) {
//   return {
//     topLeft: { x, y },
//     topRight: { x: x + w, y },
//     bottomLeft: { x, y: y + h },
//     bottomRight: { x: x + w, y: y + h }
//   }
// }

function checkPointRectangleCollision(point, rectangle) {
  const {
    leftEdge,
    rightEdge,
    topEdge,
    bottomEdge
  } = getRectangleEdges(rectangle);

  return point.x > leftEdge && point.x < rightEdge && point.y > topEdge && point.y < bottomEdge;
}

function checkRectanglesCollision(rectangle1, rectangle2) {
  const r1Edges = getRectangleEdges(rectangle1);
  const r2Edges = getRectangleEdges(rectangle2);

  return r1Edges.rightEdge > r2Edges.leftEdge &&
    r1Edges.leftEdge < r2Edges.rightEdge &&
    r1Edges.topEdge < r2Edges.bottomEdge &&
    r1Edges.bottomEdge > r2Edges.topEdge
}

function checkCircleRectangleCollision(circle, rectangle) {
  const rEdges = getRectangleEdges(rectangle);
  let testX = circle.x;
  let testY = circle.y;

  if (circle.x < rEdges.leftEdge) {
    testX = rEdges.leftEdge;
  } else if (circle.x > rEdges.rightEdge) {
    testX = rEdges.rightEdge;
  }

  if (circle.y < rEdges.topEdge) {
    testY = rEdges.topEdge;
  } else if (circle.y > rEdges.bottomEdge) {
    testY = rEdges.bottomEdge;
  }

  let distanceX = circle.x - testX;
  let distanceY = circle.y - testY;
  const distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));

  return distance < circle.r;
}

function circlesExample(e) {
  mouseCircle.x = e.clientX - canvas.offsetLeft;
  mouseCircle.y = e.clientY - canvas.offsetTop;
  updateCircles();
}

function pointRectangleExample(e) {
  mousePoint.x = e.clientX - canvas.offsetLeft;
  mousePoint.y = e.clientY - canvas.offsetTop;
  updateRectanglePoint();
}

function rectanglesExample(e) {
  mouseRectangle.x = e.clientX - (mouseRectangle.w / 2) - canvas.offsetLeft;
  mouseRectangle.y = e.clientY - (mouseRectangle.h / 2) - canvas.offsetTop;
  updateRectangles();
}

function circleRectangleExample(e) {
  mouseCircle.x = e.clientX - canvas.offsetLeft;
  mouseCircle.y = e.clientY - canvas.offsetTop;
  updateCircleRectangle();
}

// canvas.addEventListener("mousemove", circlesExample);
// circlesExample();

// canvas.addEventListener("mousemove", pointRectangleExample);
// pointRectangleExample();

// canvas.addEventListener("mousemove", rectanglesExample);
// rectanglesExample();

canvas.addEventListener("mousemove", circleRectangleExample);
updateCircleRectangle();