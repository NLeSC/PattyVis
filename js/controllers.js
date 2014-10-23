var pattyApp = angular.module('pattyApp', []);

pattyApp.controller('SearchCtrl', function ($scope, $http){
   $scope.sites = [];
   $scope.query = '';
   $scope.results = [];
   $http.get('data/sites.json').success(function (data){
       $scope.sites = data.features;
   });

   $scope.searchFn = function (value, index){
       if( !$scope.query ){ return false; }
       var re = new RegExp($scope.query, 'i');
       return ( re.test(value.properties.description) ||
           re.test(value.properties.site_interpretation) ||
           value.id == $scope.query );
   }
   $scope.$watch('results', function(newValue, oldValue) {
      var markers = newValue.map(function(site){
          return {'id': site.id, 'geometry': site.geometry, 'type': 'Feature', properties: site.properties};
      });
      plotMarkers({
        "type": "FeatureCollection",
        "features": markers
      });
   });

   $scope.lookAtSite = function(siteId) {
     // TODO goto to site view
     console.log(arguments);
   }
   $scope.showLabel = function(name) {
     addTextLabel(name, -764.0, 8.2, -1014.0);
   }
});
