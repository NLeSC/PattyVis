/*
 *  PathControls
 *  by Ben van Werkhoven (Netherlands eScience Center)
 *  
 *  free look around with mouse drag
 */

var camera;
var clock;
var path;

var bodyAngle;
var bodyAxis;
var bodyPosition;
var xAngle;	
var xAngle = 0;
var yAngle = 0;

var mouseX = window.innerWidth / 2;
var mouseY = window.innerHeight / 2;

//this factor controls mouse sensitivity
var factor = 4;

// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}

var zoom = 45;
var maxZoom = 45;

var autoWalk = false;
var firstPerson = false;

var positionOnRoad = 0;

PathControls = function (camera, path) {
	this.camera = camera;
    this.path = path;
	init();
	
	zoom = camera.fov;
	maxZoom = camera.fov;
	
	this.updateInput = function () {
		  var delta		  = clock.getDelta();
		  var elapsed     = clock.getElapsedTime();
		  var step        = 10 * delta;

		  if (autoWalk) {
			  var looptime = 120;
			  positionOnRoad = ((positionOnRoad + elapsed) % looptime) / looptime;
			  var pos = path.getPointAt(positionOnRoad);
			  
			  camera.position.set(pos.x, pos.y, pos.z);
		  } else if (firstPerson) {
			  
			  // Forward/backward
			  if(keys[87] || keys[38]){ // W or UP
			      bodyPosition.x -= Math.cos(-xAngle + Math.PI / 2) * step;
			      bodyPosition.y -= Math.cos(yAngle + Math.PI / 2) * step;
			      bodyPosition.z -= Math.sin(-xAngle + Math.PI / 2) * step;
			  }

			  if(keys[83] || keys[40]){ // S or DOWN
			      bodyPosition.x += Math.cos(-xAngle + Math.PI / 2) * step;
			      bodyPosition.y += Math.cos(yAngle + Math.PI / 2) * step;
			      bodyPosition.z += Math.sin(-xAngle + Math.PI / 2) * step;
			  }

			  // Turn
			  if(keys[90]){ // Z
				  bodyPosition.y -= step;
			  }   
			  
			  if(keys[81]){ // Q
				  bodyPosition.y += step;
			  }

			  // Straif
			  if(keys[65] || keys[37]){ // A or LEFT
			      bodyPosition.x -= Math.cos(-xAngle) * step;
			      bodyPosition.z -= Math.sin(-xAngle) * step;
			  }   
			  
			  if(keys[68] || keys[39]){ // D or RIGHT
			      bodyPosition.x += Math.cos(-xAngle) * step;
			      bodyPosition.z += Math.sin(-xAngle) * step;
			  }

			  camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
			  
		  
		  } else {
			  // Forward/backward
			  if(keys[87] || keys[38]){ // W or UP
				  positionOnRoad += 0.1 * delta;
			  }
			  if(keys[83] || keys[40]){ // S or DOWN
				  positionOnRoad -= 0.1 * delta;
			  }

			  if (positionOnRoad > 1) positionOnRoad = 1;
			  if (positionOnRoad < 0) positionOnRoad = 0;
			  
			  var pos = path.getPointAt(positionOnRoad);
			  
			  camera.position.set(pos.x, pos.y, pos.z);
		  }
		  

		  
	}	
		
}

function degInRad(deg) {
    return deg * Math.PI / 180;
}  


function init(){
  clock = new THREE.Clock();

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  
  document.addEventListener('mousemove', mousemove, false);
  document.addEventListener('mousewheel', mousewheel, false );
  document.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
  
  
  bodyAngle     = 0;
  bodyAxis      = new THREE.Vector3(0, 1, 0);
  bodyPosition  = new THREE.Vector3(4, 6, 10);

}

function onKeyDown(event) {
  keys[event.keyCode] = true;
  
  if (event.keyCode == 49) { //the 1 key
	autoWalk = !autoWalk;
	firstPerson = false;
	  
	//restart clock to continue from current position
	if (autoWalk) {
		clock.elapsedTime = 0;
	}
  }
  
  if (event.keyCode == 50) { // the 2 key
		autoWalk = false;
        firstPerson = true;
  }
  
  console.log(event.keyCode);
}

function onKeyUp(event) {
  keys[event.keyCode] = false;
}

function mousemove(event) {
	
	xAngle -= ((event.pageX) - mouseX) / (window.innerWidth / factor);
	yAngle -= ((event.pageY) - mouseY) / (window.innerHeight / factor);

	mouseX = event.pageX;
	mouseY = event.pageY;
    
	camera.rotation.order = 'YXZ';
	
	camera.rotation.y = xAngle;
	camera.rotation.x = yAngle;
	
}

function mousewheel(event) {
	
	event.preventDefault();
	event.stopPropagation();

	var delta = 0;

	if ( event.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9
		delta = event.wheelDelta;
	} else if ( event.detail !== undefined ) { // Firefox
		delta = - event.detail;
	}

	if ( delta < 0 ) {
		zoom += 2.5;
	} else {
		zoom -= 2.5;
	}
	
	if (zoom > maxZoom) zoom = maxZoom;
	if (zoom < 5) zoom = 5;
	
	camera.fov = zoom;
	camera.updateProjectionMatrix();
	
	//console.log(zoom);

}
