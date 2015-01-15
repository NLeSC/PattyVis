/**
 * http://stackoverflow.com/questions/15072152/angularjs-input-model-changes-from-integer-to-string-when-changed
 */
(function() {
  'use strict';

  function coerce2integer() {
    return {
      require: 'ngModel',
      link: function(scope, ele, attr, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          return parseInt(viewValue, 10);
        });
      }
    };
  }

  angular.module('pattyApp.utils')
    .directive('coerce2integer', coerce2integer);
})();
