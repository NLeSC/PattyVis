'use strict';

/**
 * @ngdoc overview
 * @name pattyApp
 * @description
 * # pattyApp
 *
 * Main module of the application.
 */
angular
  .module('pattyApp', [
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'pattyApp.searchbox',
    'pattyApp.minimap',
    'pattyApp.pointcloud'
  ])
  .config(function() {

  });

angular.module('pattyApp.utils', []);
angular.module('pattyApp.core', ['pattyApp.utils']);
angular.module('pattyApp.minimap', ['pattyApp.core'])
  .factory('ol', function($window) {
    return $window.ol;
  })
  .factory('proj4', function($window) {
    return $window.proj4;
  });
angular.module('pattyApp.pointcloud', ['pattyApp.core'])
  .factory('THREE', function($window) {
    return $window.THREE;
  })
  .factory('POCLoader', function($window) {
    return $window.POCLoader;
  })
  .factory('Potree', function($window) {
    return $window.Potree;
  });
angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.pointcloud']);
