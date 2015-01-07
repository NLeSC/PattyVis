'use strict';

/**
 * @ngdoc function
 * @name pattyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pattyApp
 */
angular.module('pattyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
