(function() {
  'use strict';

  function sitesservice($http) {
    var sitesUrl = 'data/sites.json';

    function onLoad(data) {
      me.all = data;
      me.filtered = data;
      me.isLoaded = true;
    }

    var me = {
      all: [],
      filtered: [],
      searched: [],
      isLoaded: false,
      find: function(query) {
        if (query) {
          this.searched = angular.copy(this.all);

          var re = new RegExp(query, 'i');

          this.searched = this.all.filter(function(site) {
            var description = site.description_site;  // jshint ignore:line
            var interpretation = site.interpretation_site; // jshint ignore:line
            return (re.test(description) ||
              re.test(interpretation) ||
              site.id === query * 1);
          }, this);
          this.filtered = this.searched;
        } else {
          this.searched = [];
          this.filtered = this.all;
        }
      },
      load: function() {
        $http.get(sitesUrl).success(onLoad);
      },
      onLoad: onLoad,
      centerOfSite: function(site) {
        var bbox = site.pointcloud_bbox;  // jshint ignore:line
        return [
          ((bbox[3] - bbox[0]) / 2) + bbox[0],
          ((bbox[4] - bbox[1]) / 2) + bbox[1],
          ((bbox[5] - bbox[2]) / 2) + bbox[2],
          // is same as:
          // ((site.bbox[3] + site.bbox[0]) / 2),
          // ((site.bbox[4] + site.bbox[1]) / 2),
          // ((site.bbox[5] + site.bbox[2]) / 2)
        ];
      },
      getAllFeatures: function() {
          if(!this.isLoaded){
              return [];
          } else {
              return this.all;
          }
      },
      getBoundingBox: function(site) {
        return site.pointcloud_bbox;  // jshint ignore:line
      },
      getBoundingBoxSize: function(site) {
        var bbox = site.pointcloud_bbox;  // jshint ignore:line
        return [
          ((bbox[3] - bbox[0]) / 2),
          ((bbox[4] - bbox[1]) / 2),
          ((bbox[5] - bbox[2]) / 2)
        ];
      }
    };
    return me;
  }

  angular.module('pattyApp.core')
    .factory('sitesservice', sitesservice);
})();
