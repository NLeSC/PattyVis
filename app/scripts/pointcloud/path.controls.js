/*
 *  PathControls
 *  by Ben van Werkhoven (Netherlands eScience Center)
 *
 *  free look around with mouse drag
 */

(function() {
	'use strict';


	var me;

	var camera;
	var clock;
	var path;
	var lookatPath;
	var drag = false;

	var bodyPosition;
	var xAngle = 0;
	var yAngle = 0;
	

	var mouseX = window.innerWidth / 2;
	var mouseY = window.innerHeight / 2;

//	this factor controls mouse sensitivity
//	should be more than 2*Math.PI to get full rotation
	var factor = 8;

//	Map for key states
	var keys = [];
	for (var i = 0; i < 130; i++) {
		keys.push(false);
	}

	var zoom = 45;
	var maxZoom = 45;

	var positionOnRoad = 0.0;
	
	var looptime = 240;

	var THREE;



	var PathControls = function($window) {
		THREE = $window.THREE;

		me = this;

		this.camera = null;
		this.path = null;
		this.useOculus = false;

		clock = new THREE.Clock();

		this.modes = {
			ONRAILS: 'onrails',
			FLY: 'fly',
			DEMO: 'demo'
		};

		this.mode = this.modes.ONRAILS;
	};


	PathControls.prototype.init = function(cam, cameraPath, lookPath, element) {
		this.camera = cam;
		camera = cam;
		
		var defLookPath = new THREE.SplineCurve3(lookPath);
		lookatPath = new THREE.SplineCurve3(defLookPath.getSpacedPoints(100));

		var definedPath = new THREE.SplineCurve3(cameraPath);
		path = new THREE.SplineCurve3(definedPath.getSpacedPoints(100));
		var pos = path.getPointAt(0);

		camera.position.copy(pos);
		camera.up.set(0, 1, 0);
		camera.rotation.order = 'YXZ';

		this.lookat(lookatPath.getPointAt(0.05));

		camera.updateProjectionMatrix();

		bodyPosition = camera.position;

		zoom = camera.fov;
		maxZoom = camera.fov;

		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);

		element.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

		element.addEventListener('mouseleave', onBlur, false);
		element.addEventListener('mouseout', onBlur, false);
		
		element.addEventListener('mousemove', mousemove, false);
		element.addEventListener('mousedown', mousedown, false);
		element.addEventListener('mouseup', mouseup, false);

		element.addEventListener('mousewheel', mousewheel, false);
		element.addEventListener('DOMMouseScroll', mousewheel, false); // firefox
	};
	
	
	/*
	 * TODO: I have a weird bug that pressing the goHome button and executing the goHome function here does not always perform a lookat correctly
	 * in particular for the firstperson (fly) mode. pressing the gohome button again fixes the lookat somehow, not sure why it does work the second time.
	 */
	PathControls.prototype.goHome = function() {
		positionOnRoad = 0.0;
		bodyPosition = path.getPointAt(0);
		
		this.lookat(path.getPointAt(0.1));
	};
	

	PathControls.prototype.goTo = function(point) {
		bodyPosition.copy(point);
	};
	
	
	function findNearestPointOnPath(path, point) {
		//first find nearest point on road
		var minDist = Number.MAX_VALUE;
		var dist = 0;
		var index = 0;
		var i;
		for (i=0; i < path.points.length; i++) {
			dist = point.distanceTo(path.points[i]);
			if (dist < minDist) {
				minDist = dist;
				index = i;
			}
		}
		
		return index;
	}
	
	function findPrecisePositionOnPath(cpath, point) {
		
		//first find nearest point on road
		var index = findNearestPointOnPath(cpath, point);
		
		//interpolate to find precise positionOnRoad
		//first find second nearest point on the road
		var distOne = Number.MAX_VALUE;
		var distTwo = Number.MAX_VALUE;
		var secondIndex = i;
		if (index !== 0) {
			distOne = point.distanceTo(cpath.points[index-1]);
		}
		if (index < cpath.points.length-1) {
			distTwo = point.distanceTo(cpath.points[index+1]);
		}
		if (distOne > distTwo) {
			secondIndex = index+1;
		} else {
			index = index-1;
			secondIndex = index+1;
		}
		         
		//interpolate using dot product of vector A and B
		
		//vector A is the vector from index to point
		var A = point.clone();
		A.sub(cpath.points[index]);
		
		//vector B is the vector from index to secondIndex
		var B = cpath.points[secondIndex].clone();
		B.sub(cpath.points[index].clone());
		B.normalize();
		
		//project vector A onto vector B
		var delta = A.dot(B) / A.length();
		
		//delta = delta / B.length();
		
		//compute new position on road
		return ((index + delta) / cpath.points.length) * looptime;
	}
	
	
	//go to a point on the road near the specified point
	PathControls.prototype.goToPointOnRoad = function(point) {	
		//find position on road
		positionOnRoad = findPrecisePositionOnPath(path, point);
		
		//move the camera there
		bodyPosition.copy(path.getPointAt(positionOnRoad / looptime));
	};


	PathControls.prototype.lookat = function(center) {
		
		camera.up = new THREE.Vector3(0,1,0);
		camera.lookAt(center);
		
		xAngle = camera.rotation.y;
		yAngle = camera.rotation.x;

	};
	
	PathControls.prototype.createPath = function() {

		var tube = new THREE.TubeGeometry(path, 1024, 0.25, 8, false);
		var lookTube = new THREE.TubeGeometry(lookatPath, 1024, 0.25, 8, false);
		
		var tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
				new THREE.MeshLambertMaterial({
					color: 0x00ffff
				}),
				new THREE.MeshBasicMaterial({
					color: 0x00ffff,
					opacity: 0.3,
					wireframe: false,
					transparent: false
			})]);
		var lookTubeMesh = THREE.SceneUtils.createMultiMaterialObject( lookTube, [
				new THREE.MeshLambertMaterial({
					color: 0x0000ff
				}),
				new THREE.MeshBasicMaterial({
					color: 0x0000ff,
					opacity: 0.3,
					wireframe: false,
					transparent: false
			})]);

		var i;
		
		tubeMesh.add(lookTubeMesh);
		
		var sphereGeo;
		var meshMat;
		var sphere;
		
		for (i=0; i<path.points.length; i++) {
			sphereGeo = new THREE.SphereGeometry(0.5,32,32);
			meshMat = new THREE.MeshBasicMaterial({color: 0xff0000});
			sphere = new THREE.Mesh(sphereGeo, meshMat);
			sphere.position.copy(path.points[i]);
			tubeMesh.add(sphere);
		}
		
		for (i=0; i<lookatPath.points.length; i++) {
			sphereGeo = new THREE.SphereGeometry(0.5,32,32);
			meshMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
			sphere = new THREE.Mesh(sphereGeo, meshMat);
			sphere.position.copy(lookatPath.points[i]);
			tubeMesh.add(sphere);
		}

		return tubeMesh;
	};

	PathControls.prototype.updateInput = function() {
		if (!path) {
			return;
		}

		var delta = clock.getDelta();
				
		if (keys[32]) {
			delta *= 6;
		}

		var step = 10 * delta;
		var pos;

		if (yAngle < -0.95 * Math.PI / 2) {
			yAngle = -0.95 * Math.PI / 2;
		}
		if (yAngle > 0.95 * Math.PI / 2) {
			yAngle = 0.95 * Math.PI / 2;
		}

		if (!this.useOculus) {
			camera.rotation.y = xAngle;
			camera.rotation.x = yAngle;
			
			camera.rotation.set(yAngle, xAngle, 0, 'YXZ');
		}
			
		if (this.mode === this.modes.DEMO) {

			positionOnRoad += delta;
			positionOnRoad = positionOnRoad % looptime;
			//javascript modulus operator allows negative numbers, correct for that
			if (positionOnRoad < 0) {
				positionOnRoad = looptime + positionOnRoad;
			}
			pos = path.getPointAt(positionOnRoad / looptime);

			camera.position.set(pos.x, pos.y, pos.z);

			//this.lookat(path.getPointAt((positionOnRoad / looptime) + 0.0001));
			
			var positionOnLookPath = (positionOnRoad / looptime) * (  path.getLength() / lookatPath.getLength() ) * 1.08 ;
			
			var lookPoint = lookatPath.getPointAt(positionOnLookPath);
			
			this.lookat(lookPoint);
			
			
			
		} else if (this.mode === this.modes.FLY) {

			// Forward/backward
			if (keys[87] || keys[119] || keys[38]) { // W or UP
				bodyPosition.x -= Math.cos(-xAngle + Math.PI / 2) * step;
				bodyPosition.y -= Math.cos(yAngle + Math.PI / 2) * step;
				bodyPosition.z -= Math.sin(-xAngle + Math.PI / 2) * step;
			}

			if (keys[83] || keys[115] || keys[40]) { // S or DOWN
				bodyPosition.x += Math.cos(-xAngle + Math.PI / 2) * step;
				bodyPosition.y += Math.cos(yAngle + Math.PI / 2) * step;
				bodyPosition.z += Math.sin(-xAngle + Math.PI / 2) * step;
			}

			// Fly up or down
			if (keys[90] || keys[122]) { // Z
				bodyPosition.y -= step;
			}

			if (keys[81] || keys[113]) { // Q
				bodyPosition.y += step;
			}

			// Strafe
			if (keys[65] || keys[97] || keys[37]) { // A or left
				bodyPosition.x -= Math.cos(-xAngle) * step;
				bodyPosition.z -= Math.sin(-xAngle) * step;
			}

			if (keys[68] || keys[100] || keys[39]) { // D or right
				bodyPosition.x += Math.cos(-xAngle) * step;
				bodyPosition.z += Math.sin(-xAngle) * step;
			}

			camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);

		} else if (this.mode === this.modes.ONRAILS) {
			// Forward/backward on the rails
			if (keys[87] || keys[38]) { // W or UP
				positionOnRoad += delta;
			}
			if (keys[83] || keys[40]) { // S or DOWN
				positionOnRoad -= delta;
			}

			positionOnRoad = positionOnRoad % looptime;
			//javascript modulus operator allows negative numbers, correct for that
			if (positionOnRoad < 0) {
				positionOnRoad = looptime + positionOnRoad;
			}

			pos = path.getPointAt(positionOnRoad / looptime);

			camera.position.copy(pos);
		} else {
			console.log('error: unknown control mode in path.controls');
		}

		
		PathControls.prototype.enableFlightMode = function() {
			this.mode = this.modes.FLY;
		};
		
		PathControls.prototype.enableRailsMode = function() {
			if (this.mode === this.modes.FLY) {
				this.goToPointOnRoad(bodyPosition);
			}
			this.mode = this.modes.ONRAILS;
		};
		
		PathControls.prototype.enableDemoMode = function() {
			if (this.mode === this.modes.FLY) {
				this.goToPointOnRoad(bodyPosition);
			}
			this.mode = this.modes.DEMO;
		};
		
		
	};

	function onKeyDown(event) {
		keys[event.keyCode] = true;
		
		if (event.keyCode === 32) {
			event.preventDefault();
		}

		if (event.keyCode === 50) { // the 2 key
			me.enableFlightMode();
		}	
		
		if (event.keyCode === 49) { //the 1 key
			me.enableRailsMode();
		}

		if (event.keyCode === 51) { //the 3 key
			me.enableDemoMode();
		}
		//console.log(event.keyCode);
	}
	

	
	
	

	function onKeyUp(event) {
		keys[event.keyCode] = false;
	}

	//a blur event is fired when we lose focus
	//in such an event we want to turn off all keys
	function onBlur() {
		
		drag = false;
		
		var i;
		for (i=0; i < keys.length; i++) {
			keys[i] = false;
		}
				
	}
	
	
	function mousedown(event) {

		//right mouse button going down!!
		if (event.button === 2) {

			event.preventDefault();

			mouseX = event.pageX;
			mouseY = event.pageY;

			drag = true;
		}
	}

	function mouseup(event) {

		//right mouse button going up!!
		if (event.button === 2) {
			event.preventDefault();
			drag = false;
		}
	}

	function mousemove(event) {
		if (!drag) {
			return;
		}

		xAngle -= factor * (event.pageX - mouseX) / (window.innerWidth);
		yAngle -= factor * (event.pageY - mouseY) / (window.innerHeight);

		mouseX = event.pageX;
		mouseY = event.pageY;

	}

	function mousewheel(event) {
		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta;
		} else if (event.detail !== undefined) { // Firefox
			delta = -event.detail;
		}

		if (delta < 0) {
			zoom += 2.5;
		} else {
			zoom -= 2.5;
		}

		if (zoom > maxZoom) {
			zoom = maxZoom;
		}
		if (zoom < 5) {
			zoom = 5;
		}

		camera.fov = zoom;
		camera.updateProjectionMatrix();

	}

	  angular.module('pattyApp.pointcloud')
	    .service('PathControls', PathControls);
})();
