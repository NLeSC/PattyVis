/* global THREE:false, POCLoader:false, Potree:false  */
(function() {
  'use strict';

  angular.module('pattyApp.pointcloud')
  .constant('THREE', THREE)
  .constant('POCLoader', POCLoader)
  .constant('Potree', Potree);
})();
