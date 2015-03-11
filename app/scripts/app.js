// The app

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
    .run(function(SitesService, DrivemapService) {
      DrivemapService.load();
      SitesService.load();
    });

  angular.module('pattyApp.templates', []);
  angular.module('pattyApp.utils', ['pattyApp.templates']);
  angular.module('pattyApp.core', ['pattyApp.utils']);
  angular.module('pattyApp.minimap', ['pattyApp.core']);
  angular.module('pattyApp.pointcloud', ['pattyApp.core']);
  angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.pointcloud']);
})();
