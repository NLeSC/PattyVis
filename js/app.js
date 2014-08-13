var defaultPointSize = 0.03;
var defaultLOD = 15;
var pointcloudPath = "bower_components/potree/resources/pointclouds/lion_takanawa/cloud.js";

var renderer;
var camera;
var scene;
var mouse = {
	x : 1,
	y : 1
};
var projector, raycaster;
var pointcloud, pointcloudMaterial;
var spStart, spEnd, sConnection;
var placeStartMode = false;
var placeEndMode = false;
var cube, cameraCube, sceneCube;

function loadSkybox() {
	cameraCube = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
	sceneCube = new THREE.Scene();

	var path = "bower_components/potree/resources/textures/skybox/";
	var format = ".jpg";
	var urls = [ path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format ];

	var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
	var material = new THREE.MeshBasicMaterial({
		color : 0xffffff,
		envMap : textureCube,
		refractionRatio : 0.95
	});

	var shader = THREE.ShaderLib["cube"];
	shader.uniforms["tCube"].value = textureCube;

	var material = new THREE.ShaderMaterial({

		fragmentShader : shader.fragmentShader,
		vertexShader : shader.vertexShader,
		uniforms : shader.uniforms,
		depthWrite : false,
		side : THREE.BackSide

	}),

	mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
	sceneCube.add(mesh);
}

function initGUI() {
	var gui = new dat.GUI({
		height : 5 * 32 - 1
	});

	var params = {
		PointSize : defaultPointSize,
		LOD : defaultLOD
	};

	var pLOD = gui.add(params, 'LOD', 0.5, 20);
	pLOD.onChange(function(value) {
		pointcloud.LOD = value;
	});

	var pPointSize = gui.add(params, 'PointSize', 0.01, 0.1);
	pPointSize.onChange(function(value) {
		pointcloudMaterial.size = value;
	});
}

function initThree() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	document.body.appendChild(renderer.domElement);

	loadSkybox();

	// pointcloud
	pointcloudMaterial = new THREE.PointCloudMaterial({
		size : defaultPointSize,
		vertexColors : true
	});
	var pco = POCLoader.load(pointcloudPath);
	pointcloud = new Potree.PointCloudOctree(pco, pointcloudMaterial);
	pointcloud.LOD = defaultLOD;
	pointcloud.rotation.set(Math.PI / 2, 0.85 * -Math.PI / 2, -0.0);
	// pointcloud.scale.set(0.5,0.5,0.5);
	pointcloud.moveToOrigin();
	pointcloud.moveToGroundPlane();
	pointcloud.position.y -= 1.6
	scene.add(pointcloud);

	// grid
	scene.add(createGrid(8, 8, 1));

	// measurement
	var sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
	var sphereMaterial = new THREE.MeshBasicMaterial({
		color : 0xbb0000,
		shading : THREE.FlatShading
	});
	spStart = new THREE.Mesh(sphereGeometry, sphereMaterial);
	spEnd = new THREE.Mesh(sphereGeometry, sphereMaterial);
	// spStart.position.set(-1.1,1.05,2);
	// spEnd.position.set(1.3,1.0,1.15);
	spStart.position.set(-2.2, 1.9, 1.66);
	spEnd.position.set(0.02, 2, 2.64);
	scene.add(spStart);
	scene.add(spEnd);

	var lc = new THREE.Color(0xff0000);
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(spStart.position.clone(), spEnd.position.clone());
	lineGeometry.colors.push(lc, lc, lc);
	var lineMaterial = new THREE.LineBasicMaterial({
		vertexColors : THREE.VertexColors
	});
	sConnection = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(sConnection);

	// controls
	camera.position.set(4, 6, 10);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 3, 0);
	camera.lookAt(controls.target);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('click', onClick, false);
}

function createGrid(width, length, spacing) {
	var material = new THREE.LineBasicMaterial({
		color : 0xBBBBBB
	});

	var geometry = new THREE.Geometry();
	for (var i = 0; i <= length; i++) {
		geometry.vertices.push(new THREE.Vector3(-(spacing * width) / 2, 0, i * spacing - (spacing * length) / 2));
		geometry.vertices.push(new THREE.Vector3(+(spacing * width) / 2, 0, i * spacing - (spacing * length) / 2));
	}

	for (var i = 0; i <= width; i++) {
		geometry.vertices.push(new THREE.Vector3(i * spacing - (spacing * width) / 2, 0, -(spacing * length) / 2));
		geometry.vertices.push(new THREE.Vector3(i * spacing - (spacing * width) / 2, 0, +(spacing * length) / 2));
	}

	var line = new THREE.Line(geometry, material, THREE.LinePieces);
	line.receiveShadow = true;
	return line;
}

function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
	requestAnimationFrame(render);

	camera.updateMatrixWorld(true);

	vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	projector.unprojectVector(vector, camera);
	raycaster.params = {
		"PointCloud" : {
			threshold : 0.1
		}
	};
	raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

	scene.traverse(function(object) {
		if (object instanceof Potree.PointCloudOctree) {
			object.update(camera);
		}
	});

	if (placeStartMode || placeEndMode) {
		var intersects = raycaster.intersectObject(pointcloud, true);

		if (intersects.length > 0) {
			var I = intersects[0];

			if (placeStartMode) {
				spStart.position = I.point;
			} else if (placeEndMode) {
				spEnd.position = I.point;
			}
			sConnection.geometry.vertices[0].copy(spStart.position);
			sConnection.geometry.vertices[1].copy(spEnd.position);
			sConnection.geometry.verticesNeedUpdate = true;
			sConnection.geometry.computeBoundingSphere();
		}
	}

	// placing distance label
	var labelPos = spStart.position.clone().add(spEnd.position).multiplyScalar(0.5);
	projector.projectVector(labelPos, camera);
	labelPos.x = (labelPos.x + 1) / 2 * window.innerWidth;
	labelPos.y = -(labelPos.y - 1) / 2 * window.innerHeight;

	var distance = spStart.position.distanceTo(spEnd.position);
	var lblDistance = document.getElementById("lblDistance");
	lblDistance.style.left = labelPos.x;
	lblDistance.style.top = labelPos.y;
	lblDistance.innerHTML = distance.toFixed(2);

	var numVisibleNodes = pointcloud.numVisibleNodes;
	var numVisiblePoints = pointcloud.numVisiblePoints;
	document.getElementById("lblNumVisibleNodes").innerHTML = "visible nodes: " + numVisibleNodes;
	document.getElementById("lblNumVisiblePoints").innerHTML = "visible points: " + Potree.utils.addCommas(numVisiblePoints);

	// render skybox
	cameraCube.rotation.copy(camera.rotation);
	renderer.render(sceneCube, cameraCube);

	renderer.render(scene, camera);
};

initThree();
initGUI();
render();

function placeStart() {
	placeStartMode = true;
	placeEndMode = false;
}

function placeEnd() {
	placeStartMode = false;
	placeEndMode = true;
}

function onClick() {
	placeStartMode = false;
	placeEndMode = false;

	console.log(spStart.position);
	console.log(spEnd.position);
}