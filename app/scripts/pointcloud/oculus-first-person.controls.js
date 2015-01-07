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

var OFPxAngle;
var OFPyAngle;

var oculusXAngle = 0;
var oculusYAngle = 0;

var quat, quatCam, xzVector;

var oculusBridge;

var OFPactive = false;

OculusFirstPersonControls = function(camera) {
	this.camera = camera;

	camera.rotation.order = 'YXZ';

	oculusBridge = new OculusBridge({
		"debug" : true,
		"onOrientationUpdate" : bridgeOrientationUpdated
	});

	clock = new THREE.Clock();

	bodyAngle = 0;
	bodyAxis = new THREE.Vector3(0, 1, 0);
	bodyPosition = camera.position;

	quat = new THREE.Quaternion();
	quatCam = new THREE.Quaternion(0, 0, 0, 0);
	xzVector = new THREE.Vector3(0, 0, 1);

	this.enable = function() {
		OFPactive = true;
		oculusBridge.connect();
	}

	this.disable = function() {
		OFPactive = false;
		oculusBridge.disconnect();
	}

	this.updateInput = function() {
		if (!OFPactive)
			return;

		var delta = clock.getDelta();
		var step = 10 * delta;
		var turn_speed = (55 * delta) * Math.PI / 180;

		if (keys[18]) {
			step *= 6; //Alt
		}

		// Forward/backward
		if (keys[87] || keys[38]) { // W or UP
			bodyPosition.x -= Math.cos(-OFPxAngle + Math.PI / 2) * step;
			bodyPosition.y -= Math.cos(OFPyAngle + Math.PI / 2) * step;
			bodyPosition.z -= Math.sin(-OFPxAngle + Math.PI / 2) * step;
		}

		if (keys[83] || keys[40]) { // S or DOWN
			bodyPosition.x += Math.cos(-OFPxAngle + Math.PI / 2) * step;
			bodyPosition.y += Math.cos(OFPyAngle + Math.PI / 2) * step;
			bodyPosition.z += Math.sin(-OFPxAngle + Math.PI / 2) * step;
		}

		// Turn
		if (keys[90]) { // Z
			bodyPosition.y -= step;
		}

		if (keys[81]) { // Q
			bodyPosition.y += step;
		}

		// Strafe
		if (keys[65] || keys[97] || keys[37]) { // A or left
			bodyPosition.x -= Math.cos(-OFPxAngle) * step;
			bodyPosition.z -= Math.sin(-OFPxAngle) * step;
		}

		if (keys[68] || keys[100] || keys[39]) { // D or right
			bodyPosition.x += Math.cos(-OFPxAngle) * step;
			bodyPosition.z += Math.sin(-OFPxAngle) * step;
		}

		camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);

	}
}

function bridgeOrientationUpdated(quatValues) {
	if (!OFPactive)
		return;

	// make a quaternion for the the body angle rotated about the Y axis.
	quat.setFromAxisAngle(bodyAxis, bodyAngle);

	// make a quaternion for the current orientation of the Rift
	quatCam.set(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

	// multiply the body rotation by the Rift rotation.
	quat.multiply(quatCam);

	//orientation
	oculusXAngle = Math
			.atan2(2 * quatValues.y * quatValues.w - 2 * quatValues.x
					* quatValues.z, 1 - 2 * (quatValues.y * quatValues.y) - 2
					* (quatValues.z * quatValues.z))
			+ Math.PI / 2;
	OFPxAngle = oculusXAngle + xAngle;

	//attitude
	oculusYAngle = Math
			.atan2(2 * quatValues.x * quatValues.w - 2 * quatValues.y
					* quatValues.z, 1.0 - 2 * (quatValues.x * quatValues.x) - 2
					* (quatValues.z * quatValues.z))
			+ Math.PI / 2;
	OFPyAngle = oculusYAngle + yAngle;

	//
	zAngle = Math.asin(2 * quatValues.x * quatValues.y + 2 * quatValues.z
			* quatValues.w);

	//Apply the combined look/body angle to the camera.
	//camera.quaternion.copy(quat);

	if (OFPyAngle < -0.95 * Math.PI / 2) {
		OFPyAngle = -0.95 * Math.PI / 2;
	}
	if (OFPyAngle > 0.95 * Math.PI / 2) {
		OFPyAngle = 0.95 * Math.PI / 2;
	}

	camera.rotation.y = OFPxAngle;
	camera.rotation.x = OFPyAngle;
	camera.rotation.z = zAngle;

}
