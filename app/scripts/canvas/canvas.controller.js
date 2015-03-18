(function() {
  'use strict';

  function CanvasController(RenderingService) {
    this.attachCanvas = function(el){
      RenderingService.attachCanvas(el);
    };
  }

  angular.module('pattyApp.canvas').controller('CanvasController', CanvasController);
})();
