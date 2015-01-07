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
    'pattyApp.searchbox'
  ])
  .config(function () {

  });

angular.module('pattyApp.core', []);
angular.module('pattyApp.searchbox', ['pattyApp.core']);
