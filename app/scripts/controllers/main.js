'use strict';

/**
 * @ngdoc function
 * @name pattyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pattyApp
 */
angular.module('pattyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
