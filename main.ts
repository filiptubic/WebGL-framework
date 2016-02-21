/// <reference path="Matrix4x4.ts" />
/// <reference path="Vector3D.ts" />
/// <reference path="constants.ts" />


var gl;
var canvas;

var mvMatrixStack:Array<Matrix4x4> = [];
var vertices: Array<Array<Vector3D>>;
var coordsVertices : Array<Vector3D>;
var eyeVector: Vector3D;
var lookAtVector: Vector3D;
var upVector: Vector3D;
var mvMatrix: Matrix4x4;

var MT: Matrix4x4 = new Matrix4x4();
var MTBack: Matrix4x4 = new Matrix4x4();
var MR: Matrix4x4 = new Matrix4x4();

var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;

var coordsVerticesBuffer;
var coordsVerticesColorBuffer;
var coordsVerticesIndexBuffer;
var coordsVerticesIndexBuffer;

var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;
var cubeVerticesIndexBuffer;
var cubeRotation = 0.0;
var cubeXOffset = 0.0;
var cubeYOffset = 0.0;
var cubeZOffset = 0.0;
var lastCubeUpdateTime = 0;
var xIncValue = 0.2;
var yIncValue = -0.4;
var zIncValue = 0.3;



function initWebGL() {
  gl = null;
  
  
  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
      console.error(e);
  }

  // If we don't have a GL context, give up now

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.getAttribute("type") == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.getAttribute("type") == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initShaders(){
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
}

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(Matrix4x4.Copy(m));
    mvMatrix = Matrix4x4.Copy(m);
  } else {
    mvMatrixStack.push(Matrix4x4.Copy(mvMatrix));
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }

  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function convertMatrixToListOfVertex3D(matrix: Array<Array<Vector3D>>) : Array<number>{
    
    var dataForCube: Array<number> = [];

    vertices.forEach(element => {
        
        for (var i = 0; i < 4; i++) {
            dataForCube.push(element[i].m_x); 
            dataForCube.push(element[i].m_y);
            dataForCube.push(element[i].m_z);
        }
    });
    
    return dataForCube;
}

function convertVectorToListOfValues(vector: Array<Vector3D>) : Array<number>{
    
    var dataCoords: Array<number> = [];
    
    for (var i = 0; i < 6; i++) {
        dataCoords.push(vector[i].m_x); 
        dataCoords.push(vector[i].m_y);
        dataCoords.push(vector[i].m_z);
    }
    
    
    return dataCoords;
}

function initBuffers() {

  
  coordsVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coordsVerticesBuffer);
  
  coordsVertices = new Array<Vector3D>(6);
  for (var i = 0; i < coordsVertices.length; i++) {
      coordsVertices[i] = new Vector3D();
  }
  coordsVertices[0].Init(0,0,0);
  coordsVertices[1].Init(0.1,0,0);
  
  coordsVertices[2].Init(0,0,0);
  coordsVertices[3].Init(0,0.1,0);
  
  coordsVertices[4].Init(0,0,0);
  coordsVertices[5].Init(0,0,0.1);
  
  MT.loadTranslate(-0.36, -0.26, 0.0);
  for (var i = 0; i < coordsVertices.length; i++) {
      coordsVertices[i] = MT.Transform(coordsVertices[i]);
  }
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(convertVectorToListOfValues(coordsVertices)), gl.STATIC_DRAW);

   var colors = [
    1.0,  0.0,  0.0,  1.0,      1.0,  0.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,      0.0,  1.0,  0.0,  1.0,
    0.0,  0.0,  1.0,  1.0,      0.0,  0.0,  1.0,  1.0
  ];

  
  coordsVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coordsVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  coordsVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coordsVerticesIndexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var coordsVertexIndices = [
    0, 1,
    2, 3,
    4, 5
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(coordsVertexIndices), gl.STATIC_DRAW);



  // Create a buffer for the cube's vertices.

  cubeVerticesBuffer = gl.createBuffer();

  // Select the cubeVerticesBuffer as the one to apply vertex
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

  // Now create an array of vertices for the cube.
  
  this.vertices = new Array<Array<Vector3D>>(6);
  for (var i = 0; i < this.vertices.length; i++) {
      vertices[i] = new Array<Vector3D>(4);   
  }
  
  vertices[0][0] = new Vector3D();
  vertices[0][0].Init(-1.0, -1.0,  1.0);
  vertices[0][1] = new Vector3D();
  vertices[0][1].Init(1.0, -1.0,  1.0);
  vertices[0][2] = new Vector3D();
  vertices[0][2].Init(1.0,  1.0,  1.0);
  vertices[0][3] = new Vector3D();
  vertices[0][3].Init(-1.0,  1.0,  1.0);
  
  vertices[1][0] = new Vector3D();
  vertices[1][0].Init(-1.0, -1.0, -1.0);
  vertices[1][1] = new Vector3D();
  vertices[1][1].Init(-1.0,  1.0, -1.0);
  vertices[1][2] = new Vector3D();
  vertices[1][2].Init(1.0,  1.0, -1.0);
  vertices[1][3] = new Vector3D();
  vertices[1][3].Init(1.0, -1.0, -1.0);
  
  vertices[2][0] = new Vector3D();
  vertices[2][0].Init(-1.0,  1.0, -1.0);
  vertices[2][1] = new Vector3D();
  vertices[2][1].Init(-1.0,  1.0,  1.0);
  vertices[2][2] = new Vector3D();
  vertices[2][2].Init(1.0,  1.0,  1.0);
  vertices[2][3] = new Vector3D();
  vertices[2][3].Init(1.0,  1.0, -1.0);
  
  vertices[3][0] = new Vector3D();
  vertices[3][0].Init(-1.0, -1.0, -1.0);
  vertices[3][1] = new Vector3D();
  vertices[3][1].Init(1.0, -1.0, -1.0);
  vertices[3][2] = new Vector3D();
  vertices[3][2].Init(1.0, -1.0,  1.0);
  vertices[3][3] = new Vector3D();
  vertices[3][3].Init(-1.0, -1.0,  1.0);
  
  vertices[4][0] = new Vector3D();
  vertices[4][0].Init(1.0, -1.0, -1.0);
  vertices[4][1] = new Vector3D();
  vertices[4][1].Init(1.0,  1.0, -1.0);
  vertices[4][2] = new Vector3D();
  vertices[4][2].Init(1.0,  1.0,  1.0);
  vertices[4][3] = new Vector3D();
  vertices[4][3].Init(1.0, -1.0,  1.0);
  
  vertices[5][0] = new Vector3D();
  vertices[5][0].Init(-1.0, -1.0, -1.0);
  vertices[5][1] = new Vector3D();
  vertices[5][1].Init(-1.0, -1.0,  1.0);
  vertices[5][2] = new Vector3D();
  vertices[5][2].Init(-1.0,  1.0,  1.0);
  vertices[5][3] = new Vector3D();
  vertices[5][3].Init(-1.0,  1.0, -1.0);
 
  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(convertMatrixToListOfVertex3D(vertices)), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  var colors2 = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0]     // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var generatedColors2 = [];

  for (var j=0; j<6; j++) 
  {
    var c = colors2[j];

    //Repeat each color four times for the four vertices of the face

    for (var i=0; i<4; i++) 
    {
      generatedColors2 = generatedColors2.concat(c);
    }
  }

  cubeVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors2), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.

  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  
}


function init(){
  canvas = document.getElementById("glcanvas");

  initWebGL();      // Initialize the GL context

  // Only continue if WebGL is available and working

  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.enable(gl.STENCIL_TEST);
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    mvMatrix = new Matrix4x4();
    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.

    initShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.

    initBuffers();

    resize();
    // Set up to draw the scene periodically.

    setInterval(display, 15);

  }
}

function resize(){
    
    perspectiveMatrix = Matrix4x4.makePerspective(45, 640.0/480.0, 0.1, 100.0);
    upVector = new Vector3D();
    eyeVector = new Vector3D();
    lookAtVector = new Vector3D();
    
    upVector.Init(0,1,0);
    eyeVector.Init(0,0,-10.0);
    lookAtVector.Init(0,0,0);
    
    mvMatrix = new Matrix4x4();
 
}

function display(){

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  
  gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
  
  mvMatrix = Matrix4x4.makeOrtho(-1,1,-1,1,-10,100);

  //draw Coords

  gl.bindBuffer(gl.ARRAY_BUFFER, coordsVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(convertVectorToListOfValues(coordsVertices)), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, coordsVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coordsVerticesIndexBuffer);
  gl.lineWidth(1.0);
 
  setMatrixUniforms();
  gl.drawElements(gl.LINES, 6, gl.UNSIGNED_SHORT, 0);


  gl.stencilFunc(gl.NOTEQUAL, 1, 1);
  mvMatrix = Matrix4x4.makeLookAt(eyeVector.m_x, eyeVector.m_y,eyeVector.m_z,
                                    lookAtVector.m_x,lookAtVector.m_y,lookAtVector.m_z,
                                    upVector.m_x, upVector.m_y, upVector.m_z);
 
  //draw Cube
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(convertMatrixToListOfVertex3D(vertices)), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


}

function moveForward()
{
    var direction = new Vector3D();
    direction.Copy(lookAtVector);
    direction.opSubstractByVector3D(eyeVector);
    direction.Normalize();
    MT.loadTranslate(direction.m_x * MOVE_SPEED, direction.m_y * MOVE_SPEED, direction.m_z * MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector);   
}

function moveBackward()
{
    var direction = new Vector3D();
    direction.Copy(eyeVector);
    direction.opSubstractByVector3D(lookAtVector);
    direction.Normalize();
    
    MT.loadTranslate(direction.m_x * MOVE_SPEED, direction.m_y * MOVE_SPEED, direction.m_z * MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector);   
}

function moveLeft()
{
    var direction = new Vector3D();
    direction.Copy(lookAtVector);
    direction.opSubstractByVector3D(eyeVector);
    direction.Normalize();
    
    var t = new Vector3D();
    t.Copy(upVector);
    t=t.Cross(direction);
    
    MT.loadTranslate(t.m_x * MOVE_SPEED, t.m_y * MOVE_SPEED, t.m_z * MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector);
}

function moveRight()
{
    var direction = new Vector3D();
    direction.Copy(lookAtVector);
    direction.opSubstractByVector3D(eyeVector);
    direction.Normalize();
    
    var t = new Vector3D();
    t.Copy(upVector);
    t=direction.Cross(t);
    
    MT.loadTranslate(t.m_x * MOVE_SPEED, t.m_y * MOVE_SPEED, t.m_z * MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector);
}

function turnLeft()
{

    MR.loadRotateY(ROTATE_SPEED * Math.PI/180.0);
    MT.loadTranslate(0.36, 0.26, 0.0);
    MTBack.loadTranslate(-0.36, -0.26, 0.0);
    
    for (var i = 0; i < coordsVertices.length; i++) {
        coordsVertices[i] = MT.Transform(coordsVertices[i]);
        coordsVertices[i] = MR.Transform(coordsVertices[i]);
        coordsVertices[i] = MTBack.Transform(coordsVertices[i]);
    }
   
    MR.loadRotate(eyeVector, upVector, ROTATE_SPEED * Math.PI/180.0);
    
    lookAtVector = MR.Transform(lookAtVector);
    
}

function turnRight() 
{
    
    MR.loadRotateY(-ROTATE_SPEED * Math.PI/180.0);
    MT.loadTranslate(0.36, 0.26, 0.0);
    MTBack.loadTranslate(-0.36, -0.26, 0.0);
    
    for (var i = 0; i < coordsVertices.length; i++) {
        coordsVertices[i] = MT.Transform(coordsVertices[i]);
        coordsVertices[i] = MR.Transform(coordsVertices[i]);
        coordsVertices[i] = MTBack.Transform(coordsVertices[i]);
    }
    
    MR.loadRotate(eyeVector, upVector, -1*ROTATE_SPEED * Math.PI/180.0);
    
    lookAtVector = MR.Transform(lookAtVector);

   
}

function moveUp()
{
    var direction = new Vector3D();
    direction.Copy(upVector);
    direction.Normalize();

    MT.loadTranslate(direction.m_x * MOVE_SPEED, direction.m_y * MOVE_SPEED, direction.m_z * MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector); 
}

function moveDown()
{
    var direction = new Vector3D();
    direction.Copy(upVector);
    direction.Normalize();

    MT.loadTranslate(direction.m_x * -MOVE_SPEED, direction.m_y * -MOVE_SPEED, direction.m_z * -MOVE_SPEED);
    
    eyeVector = MT.Transform(eyeVector);
    lookAtVector = MT.Transform(lookAtVector); 
}

function turnUp()
{   
    MR.loadRotateX(ROTATE_SPEED * Math.PI/180.0);
    MT.loadTranslate(0.36, 0.26, 0.0);
    MTBack.loadTranslate(-0.36, -0.26, 0.0);
    
    for (var i = 0; i < coordsVertices.length; i++) {
        coordsVertices[i] = MT.Transform(coordsVertices[i]);
        coordsVertices[i] = MR.Transform(coordsVertices[i]);
        coordsVertices[i] = MTBack.Transform(coordsVertices[i]);
    }
    
    var direction = new Vector3D();
    direction.Copy(lookAtVector);
    direction.opSubstractByVector3D(eyeVector);
    direction.Normalize();
    
    var t = new Vector3D();
    t.Copy(upVector);
    t=t.Cross(direction);
    
    MR.loadRotate(eyeVector, t, -ROTATE_SPEED * Math.PI/180.0);
    
    lookAtVector = MR.Transform(lookAtVector);
    
}

function turnDown()
{
    MR.loadRotateX(-ROTATE_SPEED * Math.PI/180.0);
    MT.loadTranslate(0.36, 0.26, 0.0);
    MTBack.loadTranslate(-0.36, -0.26, 0.0);
    
    for (var i = 0; i < coordsVertices.length; i++) {
        coordsVertices[i] = MT.Transform(coordsVertices[i]);
        coordsVertices[i] = MR.Transform(coordsVertices[i]);
        coordsVertices[i] = MTBack.Transform(coordsVertices[i]);
    }
    
    var direction = new Vector3D();
    direction.Copy(lookAtVector);
    direction.opSubstractByVector3D(eyeVector);
    direction.Normalize();
    
    var t = new Vector3D();
    t.Copy(upVector);
    t=t.Cross(direction);
    
    MR.loadRotate(eyeVector, t, ROTATE_SPEED * Math.PI/180.0);
    
    lookAtVector = MR.Transform(lookAtVector);
}

function keyboard(e)
{   
   switch (e.keyCode){
       case 119:
        moveForward();
       break;
       case 115:
        moveBackward();
       break;
       case 100:
        moveRight();
       break;
       case 97:
        moveLeft();
       break;
       case 101:
        turnRight();
       break;
       case 113:
        turnLeft();
       break;
       case 117:
        moveUp();
       break;
       case 106:
        moveDown();
       break;
       case 105:
        turnUp();
       break;
       case 107:
        turnDown();
       break;
   }
   
   mvMatrix = Matrix4x4.makeLookAt(eyeVector.m_x, eyeVector.m_y,eyeVector.m_z,
                                        lookAtVector.m_x,lookAtVector.m_y,lookAtVector.m_z,
                                        upVector.m_x, upVector.m_y, upVector.m_z);
    
   
    console.log(e.keyCode);

}
                

function main() {
    window.addEventListener("keydown", keyboard, false);
    window.addEventListener("keypress", keyboard, false);
    window.addEventListener("keyup", keyboard, false);
    init();
}
