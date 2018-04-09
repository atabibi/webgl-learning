// Your code here!

var gl;
$(document).ready(function () {
    var canvas = $("#renderCanvas").get(0);
    gl = canvas.getContext("webgl2", {
        antialias: false,
        depth: false,
        premultipliedAlpha:false
    });

    var triangleVertices = [
        1.0, -1.0, 0.0,
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    var triangleVertexPositionBuffer = gl.createBuffer(); //Create Buffer on gpu and return it's pointer to me!
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer); //Bind the just created buffer to gl.ARRAY_BUFFER. With this we can fill our buffer using gl.ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); //Now fill gl.ARRAY_BUFFER with our vertices that means triangleVertexPositionBuffer has our vertices now


    //Now we have a ready buffer for our vertices but we also want to have a color buffer for our vertices too!
    var triangleColors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    var triangleVertexColorBuffer = gl.createBuffer(); //Create Buffer on gpu
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer); //Disconnect gl.ARRAY_BUFFER from triangleVertexPositionBuffer and then connect it to triangleVertexColorBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW); //Fill triangleVertexColorBuffer with colors data

    //Init shaders
    var vertexSahder   = getAndCompileShader("#vertexShader");
    var fragmentShader = getAndCompileShader("#fragmentShader");

    var programShader = gl.createProgram();
    gl.attachShader(programShader, vertexSahder);
    gl.attachShader(programShader, fragmentShader);
    gl.linkProgram(programShader);

    if (!gl.getProgramParameter(programShader, gl.LINK_STATUS)) {
        alert("Erro to link program shader. See the console log.");
        console.log(gl.getProgramInfoLog(programShader));
    }

    gl.useProgram(programShader);

    var positionAttrLocation = gl.getAttribLocation(programShader, "position");
    gl.enableVertexAttribArray(positionAttrLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    //void gl.vertexAttribPointer(index, size, type,normalize , stride, offset)
    gl.vertexAttribPointer(positionAttrLocation, 3, gl.FLOAT,false, 0, 0);

    var colorAttrLocation = gl.getAttribLocation(programShader, "color");
    gl.enableVertexAttribArray(colorAttrLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    //void gl.vertexAttribPointer(index, size, type,normalize, stride, offset)
    gl.vertexAttribPointer(colorAttrLocation, 4, gl.FLOAT,false, 0, 0);


    requestAnimationFrame(runRenderLoop);

    function runRenderLoop() {
        gl.clearColor(0, 0, 0.6, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES,0,3);

        requestAnimationFrame(runRenderLoop);
    }
});

function getAndCompileShader(id) {

    var shaderType;
    var shaderName = "";
    if (id === "#vertexShader") {
        shaderType = gl.VERTEX_SHADER;
        shaderName = "Vertex Shader";
    } else if (id === "#fragmentShader") {
        shaderType = gl.FRAGMENT_SHADER;
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