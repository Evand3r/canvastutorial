const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
const collisionSelectField = /** @type {HTMLSelectElement} */ (document.querySelector("select[name='collision-type']"));

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

function checkPointCircleCollision(point, circle) {
  const { dx, dy } = pointDifference(point, circle);
  const dist = pointsDistance(dx, dy)
  return dist <= circle.r;
}

function pointDifference(point1, point2) {
  return { dx: point1.x - point2.x, dy: point1.y - point2.y }
}

function pointsDistance(dx, dy) {
  return Math.sqrt((dx ** 2) + (dy ** 2))
}

function updatePointRectangle() {
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

function updatePointCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerCircle.color = checkPointCircleCollision(mousePoint, centerCircle) ? "orange" : "#007cff";

  drawCircle(centerCircle);
  drawPoint(mousePoint);
}

function updateCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  centerCircle.color = checkCircleCollision(centerCircle, mouseCircle) ? "orange" : "#007cff";

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
  const distance = Math.sqrt((distX ** 2) + (distY ** 2));

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

function pointCircleExample(e) {
  mousePoint.x = e?.clientX - canvas.offsetLeft;
  mousePoint.y = e?.clientY - canvas.offsetTop;
  updatePointCircle();
}

function circlesExample(e) {
  mouseCircle.x = e?.clientX - canvas.offsetLeft;
  mouseCircle.y = e?.clientY - canvas.offsetTop;
  updateCircles();
}

function pointRectangleExample(e) {
  mousePoint.x = e?.clientX - canvas.offsetLeft;
  mousePoint.y = e?.clientY - canvas.offsetTop;
  updatePointRectangle();
}

function rectanglesExample(e) {
  mouseRectangle.x = e?.clientX - (mouseRectangle.w / 2) - canvas.offsetLeft;
  mouseRectangle.y = e?.clientY - (mouseRectangle.h / 2) - canvas.offsetTop;
  updateRectangles();
}

function circleRectangleExample(e) {
  mouseCircle.x = e?.clientX - canvas.offsetLeft;
  mouseCircle.y = e?.clientY - canvas.offsetTop;
  updateCircleRectangle();
}

const collisionTypes = {
  "point_circle": pointCircleExample,
  "circle_circle": circlesExample,
  "point_rectangle": pointRectangleExample,
  "rectangle_rectangle": rectanglesExample,
  "circle_rectangle": circleRectangleExample,
}
let updateFunction = collisionTypes[collisionSelectField.value];
updateFunction();
canvas.addEventListener("mousemove", updateFunction);

collisionSelectField.addEventListener("change", changeCollisionType)

function changeCollisionType(e) {
  updateFunction = collisionTypes[e.target.value];
  updateFunction();
  canvas.removeEventListener("mousemove", updateFunction)
  canvas.addEventListener("mousemove", updateFunction)
}
