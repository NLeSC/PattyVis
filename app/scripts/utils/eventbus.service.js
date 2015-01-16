(function() {
  'use strict';

  function Eventbus($rootScope) {
    this.publish = function() {
      $rootScope.$emit.apply($rootScope, arguments);
    };
    this.subscribe = function() {
      $rootScope.$on.apply($rootScope, arguments);
    };
  }

  angular.module('pattyApp.utils')
    .service('Eventbus', Eventbus);
})();
