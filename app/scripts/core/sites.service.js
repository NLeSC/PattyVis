(function() {
  'use strict';

  function SitesService($http, $q) {
    var sitesUrl = 'data/sites.json';
    // sitesUrl = 'http://148.251.106.132:8090/POTREE/CONF.json';

    function onLoad(data) {
      me.all = data;
      me.filtered = data;
      me.isLoaded = true;
      deferred.resolve(me.all);
    }
    var deferred = $q.defer();

    var me = {
      all: [],
      /**
       * List of filtered sites. When query is empty then it will contain all sites.
       * @type {Array}
       */
      filtered: [],
      /**
       * List of searched sites. When query is empty then it will contain no sites.
       * @type {Array}
       */
      searched: [],
      isLoaded: false,
      /**
       * Promise for loading the sites remotely.
       * Can be used to perform action when loading sites has been completed.
       * @type {Promise}
       */
      ready: deferred.promise,
      find: function(query) {
        if (query) {
          this.searched = angular.copy(this.all);

          var re = new RegExp(query, 'i');

          this.searched = this.all.filter(function(site) {
            var description = site.description_site; // jshint ignore:line
            var interpretation = site.interpretation_site; // jshint ignore:line
            return (re.test(description) ||
              re.test(interpretation) ||
              'site:' + site.id === query);
          }, this);
          this.filtered = this.searched;
        } else {
          this.searched = [];
          this.filtered = this.all;
        }
      },
      load: function() {
        $http.get(sitesUrl)
          .success(onLoad)
          .error(function(data, status, headers, config) {
            deferred.reject(data, status, headers, config);
          });
      },
      onLoad: onLoad,
      centerOfSite: function(site) {
        var bbox = site.pointcloud_bbox; // jshint ignore:line
        return [
          ((bbox[3] - bbox[0]) / 2) + bbox[0], ((bbox[4] - bbox[1]) / 2) + bbox[1], ((bbox[5] - bbox[2]) / 2) + bbox[2],
          // is same as:
          // ((site.bbox[3] + site.bbox[0]) / 2),
          // ((site.bbox[4] + site.bbox[1]) / 2),
          // ((site.bbox[5] + site.bbox[2]) / 2)
        ];
      },
      getAllFeatures: function() {
        if (!this.isLoaded) {
          return [];
        } else {
          return this.all;
        }
      },
      getBoundingBox: function(site) {
        return site.pointcloud_bbox; // jshint ignore:line
      },
      getBoundingBoxSize: function(site) {
        var bbox = site.pointcloud_bbox; // jshint ignore:line
        return [
          ((bbox[3] - bbox[0]) / 2), ((bbox[4] - bbox[1]) / 2), ((bbox[5] - bbox[2]) / 2)
        ];
      },
      /**
       * Get a site by it's identifier.
       * @param {Number} id Site identifier
       * @returns {Object|undefined} Site object or undefined when site was not found.
       */
      getById: function(id) {
        var sites = this.all.filter(function(d) {
          return d.id === id;
        });
        return sites[0];
      },
      selectSite: function(site) {
        this.find('site:' + site.id);
      },
      clearSiteSelection: function() {
        this.find('');
      }
    };
    return me;
  }

  angular.module('pattyApp.core')
    .factory('SitesService', SitesService);
})();
