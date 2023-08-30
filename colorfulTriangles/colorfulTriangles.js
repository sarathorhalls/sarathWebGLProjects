"use strict";

let gl;
let points;
let colorLoc;

const NumTriangles = 100;

window.onload = function init()
{
    //
    // Init WebGL
    //
    const canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    let triangles = [];

    for (let i = 0; i < NumTriangles; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        triangles.push(vec2(x, y));
        triangles.push(vec2(x + 0.2, y));
        triangles.push(vec2(x + 0.1, y + 0.2));
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    const program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    const bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Find the location of the variable fColor in the shader program

    colorLoc = gl.getUniformLocation(program, "fColor");

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    for (let i = 0; i < NumTriangles; i++) {
        gl.drawArrays(gl.TRIANGLES, i * 3, 3);
        gl.uniform4fv(colorLoc, vec4(Math.random(), Math.random(), Math.random(), 1.0))
    }
}
