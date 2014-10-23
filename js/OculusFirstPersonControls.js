/*
 *  OculusFirstPersonControls
 *  by Ben van Werkhoven (Netherlands eScience Center)
 *  
 *  requires Oculus Bridge
 *  github.com/Instrument/oculus-bridge
 */

var camera;
var clock;

var bodyAngle;
var bodyAxis;
var bodyPosition;
var xAngle;
var yAngle;

var mouseXAngle = 0;
var mouseYAngle = 0;
var oculusXAngle = 0;
var oculusYAngle = 0;

var quat, quatCam, xzVector;

var oculusBridge;

var active = false;

var initialized = false;

// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}

OculusFirstPersonControls = function (camera) {
	this.camera = camera;

	camera.rotation.order = 'YXZ';
	
	oculusBridge = new OculusBridge({
		    "debug" : true,
		    "onOrientationUpdate" : bridgeOrientationUpdated
		  });
	
	  clock = new THREE.Clock();
	  
	  init();

	  bodyAngle     = 0;
	  bodyAxis      = new THREE.Vector3(0, 1, 0);
	  bodyPosition  = camera.position;

	  quat = new THREE.Quaternion();
	  quatCam = new THREE.Quaternion(0, 0, 0, 0);
	  xzVector = new THREE.Vector3(0, 0, 1);
	
	this.enable = function () {
		active = true;
		oculusBridge.connect();
	}
	
	this.disable = function () {
		active = false;
		oculusBridge.disconnect();
	}
	
	this.updateInput = function () {
		  if (!active) return;
		
		  var delta		  = clock.getDelta();
		  var step        = 10 * delta;
		  var turn_speed  = (55 * delta) * Math.PI / 180;
		  
		  if (keys[18]) {
			  step *= 6; //Alt
		  }

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

		  // Strafe
		  if(keys[65] || keys[97] || keys[37]) { // A or left
		      bodyPosition.x -= Math.cos(-xAngle) * step;
		      bodyPosition.z -= Math.sin(-xAngle) * step;
		  }   
		  
		  if(keys[68] || keys[100] || keys[39]) { // D or right
		      bodyPosition.x += Math.cos(-xAngle) * step;
		      bodyPosition.z += Math.sin(-xAngle) * step;
		  }

		  camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
		  
	}
}

function init(){


	  document.addEventListener('keydown', this.onKeyDown, false);
	  document.addEventListener('keyup', this.onKeyUp, false);

	  document.addEventListener('mousemove', this.mousemove, false);
}

function bridgeOrientationUpdated(quatValues) {
	if (!active) return;
	
  // make a quaternion for the the body angle rotated about the Y axis.
  quat.setFromAxisAngle(bodyAxis, bodyAngle);

  // make a quaternion for the current orientation of the Rift
  quatCam.set(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

  // multiply the body rotation by the Rift rotation.
  quat.multiply(quatCam);
  
  //orientation
  oculusXAngle = Math.atan2(2*quatValues.y*quatValues.w-2*quatValues.x*quatValues.z , 1 - 2*(quatValues.y*quatValues.y) - 2*(quatValues.z*quatValues.z)) + Math.PI/2;
  xAngle = oculusXAngle + mouseXAngle;
  
  //attitude
  oculusYAngle = Math.atan2(2*quatValues.x*quatValues.w-2*quatValues.y*quatValues.z, 1.0 - 2*(quatValues.x*quatValues.x) - 2*(quatValues.z*quatValues.z)) + Math.PI/2;
  yAngle = oculusYAngle + mouseYAngle;
  
  //
  zAngle = Math.asin(2*quatValues.x*quatValues.y + 2*quatValues.z*quatValues.w);
  
  
  //Apply the combined look/body angle to the camera.
  //camera.quaternion.copy(quat);
	
	if (yAngle < -0.95 * Math.PI/2) {
		yAngle = -0.95 * Math.PI/2;
	}
	if (yAngle > 0.95 * Math.PI/2) {
		yAngle = 0.95 * Math.PI/2;
	}
  
//  camera.rotation.y = xAngle;
//  camera.rotation.x = yAngle;
	  camera.rotation.y = oculusXAngle;
	  camera.rotation.x = oculusYAngle;
  camera.rotation.z = zAngle;
  
}

function mousemove(event) {
	if (!active) return;
	
	mouseXAngle -= factor*(event.pageX - mouseX) / (window.innerWidth);
	mouseYAngle -= factor*(event.pageY - mouseY) / (window.innerHeight);

	mouseX = event.pageX;
	mouseY = event.pageY;    
	
	xAngle = oculusXAngle + mouseXAngle;
	yAngle = oculusYAngle + mouseYAngle;
	
	if (yAngle < -0.95 * Math.PI/2) {
		yAngle = -0.95 * Math.PI/2;
	}
	if (yAngle > 0.95 * Math.PI/2) {
		yAngle = 0.95 * Math.PI/2;
	}
	
	camera.rotation.y = xAngle;
	camera.rotation.x = yAngle;
	
	debugger
	
}

function onKeyDown(event) {
  keys[event.keyCode] = true;
  
  if (keys[18]) { //catch shortcuts that use ALT key
	    event.preventDefault();
  }
}

function onKeyUp(event) {
  keys[event.keyCode] = false;
}


