(function() {
  'use strict';

  function NexusController(NexusService) {
    this.service = NexusService;
  }

  angular.module('pattyApp.nexus')
    .controller('NexusController', NexusController);
})();
