/* global requestAnimationFrame:false */
(function() {
  'use strict';

  function RenderingService($q, $rootScope, $window, Potree, THREE) {
    var me = this;
    var deferred = $q.defer();
    /**
     * Promise for initializing other elements.
     * Can be used to perform initialization when three.js initialization has been completed.
     *
     * @type {Promise}
     */
    this.ready = deferred.promise;

    this.renderArea = null;
    this.renderer = null;

    this.updateRegistry = [];
    this.renderRegistry = [];

    this.mouse = {
      x: 0,
      y: 0
    };

    this.attachCanvas = function(element) {
      this.renderArea = element;
      this.initThree();
      var canvas = this.renderer.domElement;
      element.appendChild(canvas);
    };

    this.initThree = function() {
      var width = $window.innerWidth;
      var height = $window.innerHeight;

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.autoClear = false;
      this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);

      // enable frag_depth extension for the interpolation shader, if available
      this.renderer.context.getExtension('EXT_frag_depth');

      this.loop();

      deferred.resolve();
    };

    this.loop = function() {
      requestAnimationFrame(me.loop.bind(me));

      me.updateRegistry.forEach(function(toBeUpdated) {
        toBeUpdated();
      });

      me.renderRegistry.forEach(function(toBeRendered) {
        toBeRendered();
      });
    };

    $window.addEventListener('resize', function() {
      var width = $window.innerWidth;
      var height = $window.innerHeight;

      this.renderer.setSize(width, height);
    });

    this.registerToBeUpdated = function(updateFunction) {
      this.updateRegistry.push(updateFunction);
    };

    this.registerToBeRendered = function(renderFunction) {
      this.updateRegistry.push(renderFunction);
    };

    this.onMouseMove = function(event) {
      this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    };
  }

  angular.module('pattyApp.renderer').service('RenderingService', RenderingService);
})();
