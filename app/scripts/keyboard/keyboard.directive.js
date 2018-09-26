(function() {
  'use strict';

  function pattyKeyboard() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/keyboard/keyboard.directive.html',
      controller: 'KeyboardController',
      controllerAs: 'kc'
    };
  }

  angular.module('pattyApp.keyboard')
    .directive('pattyKeyboard', pattyKeyboard);
})();
