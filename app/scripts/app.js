// The app

/* global proj4:false, ol:false, THREE:false, POCLoader:false, Potree:false */
(function() {
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

    }).run(function(SitesService, DrivemapService) {
      DrivemapService.load();
      SitesService.load();
    });

  angular.module('pattyApp.templates', []);
  angular.module('pattyApp.utils', ['pattyApp.templates']);
  angular.module('pattyApp.core', ['pattyApp.utils'])
    .constant('proj4', proj4);
  angular.module('pattyApp.minimap', ['pattyApp.core'])
    .constant('ol', ol);
  angular.module('pattyApp.pointcloud', ['pattyApp.core'])
    .constant('THREE', THREE)
    .constant('POCLoader', POCLoader)
    .constant('Potree', Potree);
  angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.pointcloud']);
})();
