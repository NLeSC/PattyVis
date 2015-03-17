// The app
/* global THREE:false, POCLoader:false, Potree:false  */

(function() {
  'use strict';

  angular.module('pattyApp.three', []) 
    .constant('THREE', THREE);

  angular.module('pattyApp.potree', [])
    .constant('Potree', Potree)
    .constant('POCLoader', POCLoader);

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
      'pattyApp.measuring',
      'pattyApp.pointcloud'
    ])
    .run(function(SitesService, DrivemapService) {
      DrivemapService.load();
      SitesService.load();
    });

  angular.module('pattyApp.templates', []);
  angular.module('pattyApp.utils', ['pattyApp.templates']);
  angular.module('pattyApp.core', ['pattyApp.utils']);
  angular.module('pattyApp.minimap', ['pattyApp.core']);
  angular.module('pattyApp.measuring', ['pattyApp.potree', 'pattyApp.three']);
  angular.module('pattyApp.pointcloud', ['pattyApp.core', 'pattyApp.potree', 'pattyApp.three', 'pattyApp.measuring']);
  angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.pointcloud']);
})();
