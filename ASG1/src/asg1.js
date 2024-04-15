// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    // gl_PointSize = 20.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  // global variables
let gl;
let canvas;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global variable for UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0]
let g_selectedSize=5;
let g_selectedType="POINT";
let g_selectedSegments = 10; 

function addActionsForHTMLUI(){
  // button events 
  document.getElementById("green").onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; }
  document.getElementById("red").onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; }
  document.getElementById("clearButton").onclick = function() { g_shapesList=[]; renderAllShapes(); }

  document.getElementById("pointButton").onclick = function() { g_selectedType=POINT }
  document.getElementById("triButton").onclick = function() { g_selectedType=TRIANGLE }
  document.getElementById("circleButton").onclick = function() { g_selectedType=CIRCLE }
  document.getElementById("foxButton").onclick = function() {drawFoxImage();}

  // slider events
  document.getElementById("redSlide").addEventListener("mouseup", function() { g_selectedColor[0] = this.value/100; })
  document.getElementById("greenSlide").addEventListener("mouseup", function() { g_selectedColor[1] = this.value/100; })
  document.getElementById("blueSlide").addEventListener("mouseup", function() { g_selectedColor[2] = this.value/100; })
  document.getElementById("sizeSlide").addEventListener("mouseup", function() { g_selectedSize = this.value;})
  document.getElementById("segmentSlide").addEventListener("mouseup", function() { g_selectedSegments = this.value;})


}


function drawFoxImage() {
  var orange = [1.0, 0.65, 0.0, 1.0]; // Orange color
  var white = [1.0, 1.0, 1.0, 1.0]
  var darkGray = [0.3, 0.3, 0.3, 1.0];
var lightGray = [0.8, 0.8, 0.8, 1.0]; 
  // An array to hold all the triangles that make up the fox
  var foxTriangles = [
    // Each sub-array contains 6 values representing the x and y coordinates of each of the 3 vertices
    // For example: [x1, y1, x2, y2, x3, y3]
    
    
    [orange, -0.75, 0.5, -0.75, 0.39, -0.64, 0.39],
    [orange, -0.75, 0.39, -0.72, 0.34, -0.58, 0.34],

    [orange, -0.64, 0.39, -0.75, 0.39, -0.58, 0.34],
    [orange, -0.59, 0.34, -0.46, 0.34, -0.59, 0.0],

    [orange, -0.47, 0.34, -0.46, 0.0, -0.32, 0.34],
    [orange, -0.29, 0.50, -0.46, 0.34, -0.29, 0.39],
    [orange, -0.29, 0.39, -0.46, 0.34, -0.32, 0.34],
    
    [orange, -0.72, 0.34, -0.58, 0.0, -0.58, 0.34],
    [orange, -0.47, 0.33, -0.59, 0.0, -0.45, 0.0],

    [orange, -0.3, 0.39, -0.35, 0.11, -0.23, 0.33],
    [orange, -0.3, 0.39, -0.35, 0.11, -0.48, 0.0],

    [orange, -0.74, 0.39, -0.68, 0.11, -0.58, 0.0],
    [orange, -0.74, 0.39, -0.8, 0.33, -0.67, 0.11],

    //white
    [white, -0.8, 0.33, -0.74, 0.06, -0.67, 0.11],
    [white, -0.8, 0.33, -0.8, 0.11, -0.74, 0.06],

    [white, -0.23, 0.33, -0.35, 0.11, -0.29, 0.06],
    [white, -0.23, 0.33, -0.29, 0.06, -0.23, 0.11],

    [white, -0.67, 0.11, -0.74, 0.06, -0.63, 0.06],
    [white, -0.35, 0.11, -0.41, 0.06, -0.28, 0.06],

    [white, -0.58, 0.0, -0.58, -0.05, -0.52, 0.0],
    [white, -0.46, 0.0, -0.52, 0.0, -0.46, -0.05,],

    [white, -0.66, 0.08, -0.68, 0.06, -0.58, 0.04],
    [white, -0.64, 0.07, -0.58, 0.04, -0.58, 0.0],

    [white, -0.41, 0.06, -0.35, 0.06, -0.45, 0.04],
    [white, -0.41, 0.06, -0.46, 0.05, -0.46, 0.0],

    // dgray

    [darkGray, -0.52, 0.0, -0.47, -0.05, -0.57, -0.05],
    // [white, -0.41, 0.06, -0.46, 0.05, -0.57, -0.05],






  ];

  // Loop through each set of vertices and call drawTriangle with the specified color
  for (var i = 0; i < foxTriangles.length; i++) {
    var color = foxTriangles[i][0];
    var vertices = foxTriangles[i].slice(1); // Get the vertices excluding the color

    setTriangleColor(color); // Set the color for the current triangle
    drawTriangle(vertices); // Draw the triangle with the current vertices
  }
}

function setTriangleColor(color) {
  // Uses the uniform location of u_FragColor obtained in your shader setup
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
}

function main() {

  // set up canvas and gl variables
  setupWebGL();
  // set up GLSL and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // drawFoxImage();

  // Draw the triangle
  // drawTriangle([0, 0.5,   -0.5, -0.5,   0.5, -0.5]);

}


var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point

function click(ev) {

  // extract the event click and return it in WebGL coordinats
  let [x,y] = convertCoordinatesEventToGL(ev);
  // create and store the new point
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_selectedSegments; // Seting the num of segments
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // Store the coordinates to g_points array
  // g_colors.push(g_selectedColor.slice());
  // store the size to the g sizes array
  // g_sizes.push(g_selectedSize);

  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return ([x,y]);
}

function renderAllShapes(){
  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}