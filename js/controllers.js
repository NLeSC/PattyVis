var pattyApp = angular.module('pattyApp', []);

pattyApp.controller('SearchCtrl', function ($scope, $http){
   $scope.results = [];
   $http.get('data/sites.json').success(function (data){
       $scope.results = data.features;
   });
});
