"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2( -1,  1 ),
        vec2(  1, -1 ),
        vec2(  1,  1)
    ];

    divideRectangle( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function rect( a, b, c, d ) {
    points.push( a, b, c, b, c, d );
}

function divideRectangle( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        rect( a, b, c, d );
    }
    else {

        // bisect the sides

        const ab1 = mix( a, b, 1/3 );
        const ab2 = mix( a, b, 2/3 );
        const ac1 = mix( a, c, 1/3 );
        const ac2 = mix( a, c, 2/3 );
        const bd1 = mix( b, d, 1/3 );
        const bd2 = mix( b, d, 2/3 );
        const cd1 = mix( c, d, 1/3 );
        const cd2 = mix( c, d, 2/3 );

        // bisect points inside rectangle
        const abc = mix(ab1, cd1, 1/3);
        const acd = mix(ab1, cd1, 2/3);
        const abd = mix(ab2, cd2, 1/3);
        const bcd = mix(ab2, cd2, 2/3);

        --count;

        // three new triangles

        divideRectangle(  a, ab1, ac1, abc, count);
        divideRectangle(ab1, ab2, abc, abd, count); 
        divideRectangle(ab2,   b, abd, bd1, count);
        divideRectangle(abd, bd1, bcd, bd2, count);
        divideRectangle(bcd, bd2, cd2,   d, count);
        divideRectangle(acd, bcd, cd1, cd2, count);
        divideRectangle(ac2, acd,   c, cd1, count);
        divideRectangle(ac1, abc, ac2, acd, count);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
