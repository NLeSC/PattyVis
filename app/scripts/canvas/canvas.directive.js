(function() {
  'use strict';

function canvasDirective() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      scope.canvas.attachCanvas(element[0]);
    },
    controller: 'CanvasController',
    controllerAs: 'canvas'
  };
}

angular.module('pattyApp.canvas').directive('canvasDirective', canvasDirective);
})();
