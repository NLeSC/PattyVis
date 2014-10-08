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
var viewAngle;
var yAngle;

var quat, quatCam, xzVector;

var oculusBridge;

var active = false;

// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}

OculusFirstPersonControls = function (camera) {
	this.camera = camera;
	init();
	
	this.enable = function () {
		active = true;
	}
	
	this.disable = function () {
		active = false;
	}
	
	this.updateInput = function () {
		  if (!active) return;
		
		  var delta		  = clock.getDelta();
		  var step        = 10 * delta;
		  var turn_speed  = (55 * delta) * Math.PI / 180;

		  // Forward/backward
		  if(keys[87] || keys[38]){ // W or UP
		      bodyPosition.x += Math.cos(-viewAngle) * step;
		      bodyPosition.y -= Math.cos(yAngle) * step;
		      bodyPosition.z += Math.sin(-viewAngle) * step;
		  }

		  if(keys[83] || keys[40]){ // S or DOWN
		      bodyPosition.x -= Math.cos(-viewAngle) * step;
		      bodyPosition.y += Math.cos(yAngle) * step;
		      bodyPosition.z -= Math.sin(-viewAngle) * step;
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
		      bodyPosition.x -= Math.cos(-viewAngle + Math.PI/2) * step;
		      bodyPosition.z -= Math.sin(-viewAngle + Math.PI/2) * step;
		  }   
		  
		  if(keys[68] || keys[39]){ // D or RIGHT
		      bodyPosition.x += Math.cos(-viewAngle + Math.PI/2) * step;
		      bodyPosition.z += Math.sin(-viewAngle + Math.PI/2) * step;
		  }

		  camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
		  
	}
}

function init(){
  clock = new THREE.Clock();

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  bodyAngle     = 0;
  bodyAxis      = new THREE.Vector3(0, 1, 0);
  bodyPosition  = new THREE.Vector3(4, 6, 10);

  quat = new THREE.Quaternion();
  quatCam = new THREE.Quaternion(0, 0, 0, 0);
  xzVector = new THREE.Vector3(0, 0, 1);
  
  oculusBridge = new OculusBridge({
    "debug" : true,
    "onOrientationUpdate" : bridgeOrientationUpdated
  });
  oculusBridge.connect();

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
  viewAngle = Math.atan2(2*quatValues.y*quatValues.w-2*quatValues.x*quatValues.z , 1 - 2*(quatValues.y*quatValues.y) - 2*(quatValues.z*quatValues.z)) + Math.PI/2;
  
  //attitude
  yAngle = Math.atan2(2*quatValues.x*quatValues.w-2*quatValues.y*quatValues.z, 1.0 - 2*(quatValues.x*quatValues.x) - 2*(quatValues.z*quatValues.z)) + Math.PI/2;
  
  //Apply the combined look/body angle to the camera.
  camera.quaternion.copy(quat);
}

function onKeyDown(event) {
  keys[event.keyCode] = true;  
}

function onKeyUp(event) {
  keys[event.keyCode] = false;
}


