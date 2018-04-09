// Your code here!

var gl;
$(document).ready(function () {
    var canvas = $("#renderCanvas").get(0);
    gl = canvas.getContext("webgl2");

    
    var traingleVerticesAndColors = [
        1.0,  -1.0, 0.1,  1.0, 0.0, 0.0, 1.0,
        0.0,   1.0, 0.1,  0.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.1,  0.0, 0.0, 1.0, 1.0
    ];

    var traingleVertexBuffer = gl.createBuffer(); //Create Buffer on gpu and return it's pointer to me!
    gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexBuffer); //Bind the just created buffer to gl.ARRAY_BUFFER. With this we can fill our buffer using gl.ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(traingleVerticesAndColors), gl.STATIC_DRAW); //Now fill gl.ARRAY_BUFFER with our vertices that means traingleVerticesAndColors has our vertices now

   
    //-----------Init shaders-----------------
    var vertexSahder   = getAndCompileShader("#vertexShader",gl.VERTEX_SHADER);
    var fragmentShader = getAndCompileShader("#fragmentShader",gl.FRAGMENT_SHADER);
 
    var programShader = gl.createProgram();
    gl.attachShader(programShader, vertexSahder);
    gl.attachShader(programShader, fragmentShader);
    gl.linkProgram(programShader);

    if (!gl.getProgramParameter(programShader, gl.LINK_STATUS)) {
        alert("Erro to link program shader. See the console log.");
        console.log(gl.getProgramInfoLog(programShader));
    }

   
    gl.useProgram(programShader);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const FLOATSIZE = 4;
    
    var positionAttrLocation = gl.getAttribLocation(programShader, "position");
    var colorAttrLocation    = gl.getAttribLocation(programShader, "color");
    
    gl.bindBuffer(gl.ARRAY_BUFFER ,traingleVertexBuffer);

    gl.enableVertexAttribArray(positionAttrLocation);
    //void gl.vertexAttribPointer(index, size, type,normalize , stride, offset)
    gl.vertexAttribPointer(positionAttrLocation, 3, gl.FLOAT,false, FLOATSIZE*7, 0);

   
    gl.enableVertexAttribArray(colorAttrLocation);
    //void gl.vertexAttribPointer(index, size, type,normalize, stride, offset) 
    gl.vertexAttribPointer(colorAttrLocation, 4, gl.FLOAT,false, FLOATSIZE*7, FLOATSIZE*3);

    //--------Drawing---------------
    requestAnimationFrame(runRenderLoop);

    function runRenderLoop() {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindVertexArray(vao);
        
        gl.useProgram(programShader);
        gl.drawArrays(gl.TRIANGLES,0,3);

      
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