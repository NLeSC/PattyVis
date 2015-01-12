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
    'pattyApp.searchbox',
    'pattyApp.minimap'
  ])
  .config(function () {

  });

angular.module('pattyApp.core', []);
angular.module('pattyApp.searchbox', ['pattyApp.core']);
angular.module('pattyApp.minimap', ['pattyApp.core'])
       .factory('ol', function($window) {
         return $window.ol;
       })
       .factory('proj4', function($window) {
         return $window.proj4;
       });
