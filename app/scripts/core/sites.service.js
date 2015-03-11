(function() {
  'use strict';

  function SitesService($http, $q) {
    var sitesUrl = 'http://148.251.106.132:8090/POTREE/CONF.json';
    // to work without server uncomment below
    // sitesUrl = 'data/sites.json';

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
      getAllFeatures: function() {
        if (!this.isLoaded) {
          return [];
        } else {
          return this.all;
        }
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
      },
      // Methods for one site
      /**
       * Determines bounding box based on footprint.
       * @param {Site} site
       * @return {array} [minlon, minlat, minalt, maxlon, maxlat, maxalt]
       */
      getBoundingBoxOfFootprint: function(site) {
        var minlon = Number.POSITIVE_INFINITY;
        var minlat = Number.POSITIVE_INFINITY;
        var minalt = site.footprint_altitude[0]; // jshint ignore:line
        var maxlon = Number.NEGATIVE_INFINITY;
        var maxlat = Number.NEGATIVE_INFINITY;
        var maxalt = site.footprint_altitude[1]; // jshint ignore:line

        site.footprint.forEach(function(polygon) {
          polygon.forEach(function(ring) {
            ring.forEach(function(point) {
              if (point[0] < minlon) {
                minlon = point[0];
              }
              if (point[0] > maxlon) {
                maxlon = point[0];
              }
              if (point[1] < minlat) {
                minlat = point[1];
              }
              if (point[1] > maxlat) {
                maxlat = point[1];
              }
            });
          });
        });

        var bbox = [minlon, minlat, minalt, maxlon, maxlat, maxalt];
        return bbox;
      },
      centerOfSite: function(site) {
        var bbox = this.getBoundingBox(site);
        return [
          ((bbox[3] - bbox[0]) / 2) + bbox[0], ((bbox[4] - bbox[1]) / 2) + bbox[1], ((bbox[5] - bbox[2]) / 2) + bbox[2]
        ];
      },
      /**
       * If site has footprint and pointcloud then returns bbox of pointcloud.
       * If site has footprint and no pointcloud then returns bbox of footprint.
       * @param {Site} site [description]
       * @return {array} [minlon, minlat, minalt, maxlon, maxlat, maxalt]
       */
      getBoundingBox: function(site) {
        if ('pointcloud_bbox' in site) {
          return site.pointcloud_bbox; // jshint ignore:line
        } else {
          return this.getBoundingBoxOfFootprint(site);
        }
      },
      getBoundingBoxSize: function(site) {
        var bbox = this.getBoundingBox(site);
        return [
          ((bbox[3] - bbox[0]) / 2), ((bbox[4] - bbox[1]) / 2), ((bbox[5] - bbox[2]) / 2)
        ];
      }
    };
    return me;
  }

  angular.module('pattyApp.core')
    .factory('SitesService', SitesService);
})();
