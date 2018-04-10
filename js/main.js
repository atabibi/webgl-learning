/// <reference path="gl-matrix.js" />

var gl;

function createTriangle() {

    triangle = {};

    triangle.traingleVerticesAndColors = [
        1.0,  -1.0, 0.0,  1.0, 0.0, 0.0, 1.0,
        0.0,   1.0, 0.0,  0.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.0,  0.0, 0.0, 1.0, 1.0
    ];

   

    triangle.traingleVertexBuffer = gl.createBuffer(); //Create Buffer on gpu and return it's pointer to me!
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle.traingleVertexBuffer); //Bind the just created buffer to gl.ARRAY_BUFFER. With this we can fill our buffer using gl.ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle.traingleVerticesAndColors), gl.STATIC_DRAW); //Now fill gl.ARRAY_BUFFER with our vertices that means traingleVerticesAndColors has our vertices now

   
    //-----------Init shaders-----------------
    triangle.vertexSahder   = getAndCompileShader("#vertexShader",gl.VERTEX_SHADER);
    triangle.fragmentShader = getAndCompileShader("#fragmentShader",gl.FRAGMENT_SHADER);
 
    triangle.programShader = gl.createProgram();
    gl.attachShader(triangle.programShader, triangle.vertexSahder);
    gl.attachShader(triangle.programShader, triangle.fragmentShader);
    gl.linkProgram(triangle.programShader);

    if (!gl.getProgramParameter(triangle.programShader, gl.LINK_STATUS)) {
        alert("Erro to link program shader. See the console log.");
        console.log(gl.getProgramInfoLog(triangle.programShader));
    }

    gl.useProgram(triangle.programShader);


    triangle.vao = gl.createVertexArray();
    gl.bindVertexArray(triangle.vao);

  
    var FLOATSIZE = 4;
    
    triangle.positionAttrLocation = gl.getAttribLocation(triangle.programShader, "position");
    triangle.colorAttrLocation    = gl.getAttribLocation(triangle.programShader, "color");
    
 

    gl.bindBuffer(gl.ARRAY_BUFFER ,triangle.traingleVertexBuffer);

    gl.enableVertexAttribArray(triangle.positionAttrLocation);
    //void gl.vertexAttribPointer(index, size, type,normalize , stride, offset)
    gl.vertexAttribPointer(triangle.positionAttrLocation, 3, gl.FLOAT,false, FLOATSIZE*7, 0);

   
    gl.enableVertexAttribArray(triangle.colorAttrLocation);
    //void gl.vertexAttribPointer(index, size, type,normalize, stride, offset) 
    gl.vertexAttribPointer(triangle.colorAttrLocation, 4, gl.FLOAT,false, FLOATSIZE*7, FLOATSIZE*3);
   

    triangle.modelMatrix = mat4.create();
    triangle.modelMatrixLocation = gl.getUniformLocation(triangle.programShader, "modelMatrix");

    //--
    triangle.draw = function(angle, position){
        mat4.identity(triangle.modelMatrix);
        mat4.translate(triangle.modelMatrix,triangle.modelMatrix,position);
       // mat4.fromTranslation(modelMatrix, [0, 0, -7]);
        //mat4.fromYRotation(modelMatrix, angle);
        mat4.rotateY(triangle.modelMatrix,triangle.modelMatrix,angle);
        gl.uniformMatrix4fv(triangle.modelMatrixLocation, false, triangle.modelMatrix);

        gl.bindVertexArray(triangle.vao);
        
        gl.useProgram(triangle.programShader);
        gl.drawArrays(gl.TRIANGLES,0,3);
    };

    return triangle;
}

$(document).ready(function () {
    var canvas = $("#renderCanvas").get(0);
    gl = canvas.getContext("webgl2");

    var triangle = createTriangle();
   
  
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, 45* Math.PI/180.0, canvas.width/canvas.height, 0.1 , 10.0);
    //mat4.ortho(projectionMatrix,-2,2,-2,2,-10,10);

    
    var viewMatrixLocation = gl.getUniformLocation(triangle.programShader, "viewMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(triangle.programShader, "projectionMatrix");

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    


    var angle = 0.1;

    requestAnimationFrame(runRenderLoop);

    function runRenderLoop() {

        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        triangle.draw(angle, [1,-1,-7]);
        triangle.draw(angle, [-1,-1,-7]);
        triangle.draw(angle, [1,1,-7]);
        triangle.draw(angle, [-1,1,-7]);
        angle += 0.1;     
      
        requestAnimationFrame(runRenderLoop);
    }
});

function getAndCompileShader(id,shaderType) {

    //var shaderType;
    var shaderName = "";
    if (shaderType === gl.VERTEX_SHADER) {
        shaderName = "Vertex Shader";
    } else if (shaderType === gl.FRAGMENT_SHADER) {
        shaderName = "Fragment Shader";
    } else {
        console.log("Error! Not known shader type");
        alert("Input Shader is not valid!");
        return null;
    }

    var shaderElement = $(id).get(0);

    var shaderText = shaderElement.text.trim();

    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error to compile " + shaderName + ". See console log");
        console.log("Error: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;


}