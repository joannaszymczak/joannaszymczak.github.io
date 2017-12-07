var sprites, ghosts, convas, context, button, pacMan, tl;
var vw, vh, path, pathPoints, pathHandles;

window.onload = function() {
  TweenLite.defaultEase = Linear.easeNone;

  ghosts  = document.querySelectorAll(".ghost");
  pacMan  = document.querySelector("#pac-man");
  button  = document.querySelector("#random");
  canvas  = document.querySelector("#canvas");
  context = canvas.getContext("2d");
  sprites = [ghosts, pacMan];
  tl = new TimelineMax({ repeat: -1 });
  init()
};

function randomize() {
      
  tl.seek(0).clear();
  
  var points = [];
  
  for (var x = -300; x <= (vw + 200); x += 200) {
    points.push({
      x: x + random(100, 200),
      y: random(50, vh - 50)
    });
  }
  
  var startPoint = {
    x: points[0].x,
    y: points[0].y
  };
  
  points.unshift(startPoint);
    
  createPaths(points);
  
  TweenLite.set(sprites, {
    x: startPoint.x,
    y: startPoint.y
  });
  
  var bezier = {
    autoRotate: true,
    values: points,
    type: "soft",
  };
  
  tl.to(pacMan, 3, { bezier: bezier })
    .staggerTo(ghosts, 4, { bezier: bezier }, 0.25, 0.1);
}

function paintPaths() {
  
  context.clearRect(0, 0, vw, vh);
  
  context.lineWidth = 3;
  context.strokeStyle = "#3f51b5";
  context.stroke(path);
  
  context.lineWidth = 1;
  context.strokeStyle = "#757575";
  context.stroke(pathHandles);
  
  context.fillStyle = "#757575";
  context.strokeStyle = "#e3f2fd";
  context.fill(pathPoints);
  context.stroke(pathPoints);
}

function init() {
    
  TweenLite.set(sprites, {
    autoAlpha: 1,
    xPercent: -50,
    yPercent: -50
  });
  
  resize();
  randomize();
  window.addEventListener("resize", resize);
  button.addEventListener("click", randomize);
  button.focus();
}

function createPaths(points) {
  
  path = new Path2D();
  pathPoints = new Path2D();
  pathHandles = new Path2D();
  
  var radius = 3.5;
  
  var size = points.length;
  var mids = [];
  
  for (var i = 0; i < size - 1; i++) {
    
    var p1 = points[i];
    var p2 = points[i+1];
    
    mids.push({
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    });
  }
  
  var p0 = points[0];
  
  path.moveTo(p0.x, p0.y);
  
  pathHandles.moveTo(p0.x, p0.y); 
  
  pathPoints.moveTo(p0.x + radius, p0.y);
  pathPoints.arc(p0.x, p0.y, radius, 0, Math.PI * 2);
  
  for (var i = 1; i < size - 2; i++) {
    
    var p1 = points[i];
    var p2 = mids[i];
    
    path.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);    
    
    pathHandles.lineTo(p1.x, p1.y);
    pathHandles.lineTo(p2.x, p2.y);
    
    pathPoints.moveTo(p1.x + radius, p1.y);
    pathPoints.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
  }
  
  var p1 = points[i];
  var p2 = points[i+1];
  
  path.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);  
  
  pathHandles.lineTo(p1.x, p1.y);
  pathHandles.lineTo(p2.x, p2.y);
  
  pathPoints.moveTo(p1.x + radius, p1.y);
  pathPoints.arc(p1.x, p1.y, radius, 0, Math.PI * 2);  
  pathPoints.moveTo(p2.x + radius, p2.y);
  pathPoints.arc(p2.x, p2.y, radius, 0, Math.PI * 2);
  
  paintPaths();
}

function resize() {
  vw = canvas.width  = window.innerWidth;
  vh = canvas.height = window.innerHeight;
  path && paintPaths();
}

function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}