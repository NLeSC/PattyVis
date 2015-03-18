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
      'pattyApp.renderer',
      'pattyApp.canvas',
      'pattyApp.minimap',
      'pattyApp.measuring',
      'pattyApp.pointcloud',
      'pattyApp.searchbox'
    ])
    .run(function(SitesService, DrivemapService) {
      DrivemapService.load();
      SitesService.load();
    });

  angular.module('pattyApp.templates', []);
  angular.module('pattyApp.utils', ['pattyApp.templates']);
  angular.module('pattyApp.core', ['pattyApp.utils']);
  angular.module('pattyApp.minimap', ['pattyApp.core']);
  angular.module('pattyApp.renderer', ['pattyApp.potree', 'pattyApp.three']);
  angular.module('pattyApp.canvas', ['pattyApp.renderer']);
  angular.module('pattyApp.measuring', ['pattyApp.renderer']);
  angular.module('pattyApp.pointcloud', ['pattyApp.core', 'pattyApp.renderer', 'pattyApp.measuring']);
  angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.renderer', 'pattyApp.pointcloud']);
})();
