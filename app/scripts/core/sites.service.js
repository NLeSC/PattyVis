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
      all: {},
      filtered: {},
      searched: {},
      isLoaded: false,
      find: function(query) {
        if (query) {
          this.searched = angular.copy(this.all);

          var re = new RegExp(query, 'i');

          this.searched.features = this.all.features.filter(function(site) {
            return (re.test(site.properties.description) ||
              re.test(site.properties.interpretation) ||
              site.id === query * 1);
          }, this);
          this.filtered = this.searched;
        } else {
          this.searched = {};
          this.filtered = this.all;
        }
      },
      load: function() {
        $http.get(sitesUrl).success(onLoad);
      },
      onLoad: onLoad,
      centerOfSite: function(site) {
        return [
          ((site.bbox[3] - site.bbox[0]) / 2) + site.bbox[0],
          ((site.bbox[4] - site.bbox[1]) / 2) + site.bbox[1],
          ((site.bbox[5] - site.bbox[2]) / 2) + site.bbox[2],
          // is same as:
          // ((site.bbox[3] + site.bbox[0]) / 2),
          // ((site.bbox[4] + site.bbox[1]) / 2),
          // ((site.bbox[5] + site.bbox[2]) / 2)
        ];
      },
      getCrs: function() {
        return me.all.crs.properties.name;
      },
      getAllFeatures: function() {
//          var it = angular.copy(this);
//          console.log('getAllFeatures');
//          console.log('check');
//          console.log(it);
//          console.log(it.all);
//          console.log('blala');
          if(!this.isLoaded){
              console.log('leeg');
              return [];
          } else {
              console.log('niet leeg');
              console.log(all.features);
              return this.all.features;
          }
      },
      getBoundingBox: function(site) {
        return site.bbox;
      },
      getBoundingBoxSize: function(site) {
        return [
          ((site.bbox[3] - site.bbox[0]) / 2),
          ((site.bbox[4] - site.bbox[1]) / 2),
          ((site.bbox[5] - site.bbox[2]) / 2)
        ];
      }

    };
    return me;
  }

  angular.module('pattyApp.core')
    .factory('sitesservice', sitesservice);
})();
