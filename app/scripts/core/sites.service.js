/**
 * @namespace core
 */
(function() {
  'use strict';

  /**
   * Sites data model service.
   * Fetches and stores a collection of sites.
   * The collection of sites can be filtered.
   *
   * @constructs core.SitesService
   * @memberOf core
   */
  function SitesService($http, $q, $rootScope, pattyConf, Messagebus) {

    function onLoad(data) {
      service.all = data;
      service.filtered = data;
      service.searched = [];
      deferred.resolve(service.all);
      service.onSitesChanged();
    }
    var deferred = $q.defer();

    var service = /** @lends core.SitesService */ {
      _query: '',
      /**
       * List of all sites.
       *
       * @type {Array}
       */
      all: [],
      /**
       * List of filtered sites. When query is empty then it will contain all sites.
       *
       * @type {Array}
       */
      filtered: [],
      /**
       * List of searched sites. When query is empty then it will contain no sites.
       *
       * @type {Array}
       */
      searched: [],
      /**
       * Promise for loading the sites remotely.
       * Can be used to perform action when loading sites has been completed.
       *
       * @type {Promise}
       */
      ready: deferred.promise,
      /**
       * Fetches sites from server
       *
       * @returns {Promise}
       */
      load: function() {
        $http.get(pattyConf.SITES_JSON_URL)
          .success(onLoad)
          .error(function(data, status, headers, config) {
            deferred.reject(data, status, headers, config);
          });
      },
      onLoad: onLoad,
      /**
       * Get a site by it's identifier.
       *
       * @param {Number} id Site identifier
       * @returns {Object|undefined} Site object or undefined when site was not found.
       */
      getById: function(id) {
        var sites = this.all.filter(function(d) {
          return d.id === id;
        });
        return sites[0];
      },
      /**
       * Select a site.
       *
       * @param {Site} site
       */
      selectSite: function(site) {
        this.query = 'site:' + site.id;
      },
      /**
       * Clears the site selection
       *
       */
      clearSiteSelection: function() {
        this.query = '';
      },
      /**
       * @fires sitesChanged
       */
      onSitesChanged: function() {
        /**
         * Sites changed event
         * @event sitesChanged
         */
        Messagebus.publish('sitesChanged');

        if(this.searched.length===1){
          Messagebus.publish('singleSite', this.searched[0]);
        }

        // angular does not know that SitesService.searched and SitesService.filtered when query has been changed
        // trigger a $digest to let angular detect changes
        if (!$rootScope.$$phase) {
          $rootScope.$digest();
        }
      },
      // Methods for one site
      /**
       * Determines bounding box based on footprint.
       *
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
      /**
       * Center position of site based on it's bounding box.
       *
       * @param {Site} site
       * @returns {Array} [lon, lat, alt]
       */
      centerOfSite: function(site) {
        var bbox = this.getBoundingBox(site);
        return [
          ((bbox[3] - bbox[0]) / 2) + bbox[0], ((bbox[4] - bbox[1]) / 2) + bbox[1], ((bbox[5] - bbox[2]) / 2) + bbox[2]
        ];
      },
      /**
       * If site has footprint and pointcloud then returns bbox of pointcloud.
       * If site has footprint and no pointcloud then returns bbox of footprint.
       *
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
      /**
       * Size of bounding box
       *
       * @param {Site} site
       * @returns {array} [sizelon, sizelat, sizealt]
       */
      getBoundingBoxSize: function(site) {
        var bbox = this.getBoundingBox(site);
        return [
          ((bbox[3] - bbox[0]) / 2), ((bbox[4] - bbox[1]) / 2), ((bbox[5] - bbox[2]) / 2)
        ];
      }
    };
    /**
     * Query string, to search/filter the collection of sites.
     *
     * @name query
     * @type {string}
     * @memberOf core.SitesService#
     */
    Object.defineProperty(service, 'query', {
      get: function() {
        return this._query;
      },
      set: function(query) {
        if (this._query === query) {
          return;
        }
        this._query = query;
        if (query) {
          var re = new RegExp(query, 'i');

          this.filtered = this.searched = this.all.filter(function(site) {
            var descriptionSite = site.description_site; // jshint ignore:line
            var siteInterpretation = site.site_interpretation; // jshint ignore:line
            var siteContext = site.site_context; // jshint ignore:line
            var allText = descriptionSite +
              ' ' + siteInterpretation +
              ' ' + siteContext;

            for (var i = 0; i < site.objects.length; i++) {
              var object = site.objects[i];
              allText += ' ' + object.description_restorations;
              allText += ' ' + object.object_interpretation;
              allText += ' ' + object.date_specific;
              allText += ' ' + object.object_type;
              allText += ' ' + object.period;
              allText += ' ' + object.description_object;
              allText += ' ' + object.Damaged;

              for (var j = 0; j < object.object_material.length; j++) {
                var objectMaterial = object.object_material[j];
                allText += ' ' + objectMaterial.material_subtype;
                allText += ' ' + objectMaterial.material_type;
                allText += ' ' + objectMaterial.material_technique;
              }
            }

            return (re.test(allText) ||
                    'site:' + site.id === query);
          }, this);
          console.log(this.filtered.length + ' search result(s)');
        } else {
          this.searched = [];
          this.filtered = this.all;
        }
        this.onSitesChanged();
      },
      enumerable: true,
      configurable: true
    });

    return service;
  }

  angular.module('pattyApp.core')
    .factory('SitesService', SitesService);
})();
