/**
 * Constants of core module
 *
 * @namespace core
 */
/* global proj4:false */
(function() {
  'use strict';

  angular.module('pattyApp.core')
    .constant('proj4', proj4)
    /**
     * @class core.pattyConf
     * @memberOf core
     */
    .constant('pattyConf', {
      /**
       * Url for json file with sites array
       *
       * @type {String}
       * @memberof core.pattyConf
       */
      SITES_JSON_URL: 'http://148.251.106.132:8090/POTREE/CONF.json',
      // to work without server uncomment below
      // SITES_JSON_URL: 'data/sites.json',
      /**
       * Url for json file with drivemap url, cameraPath, coordinate system, etc.
       *
       * @type {String}
       * @memberof core.pattyConf
       */
      DRIVEMAP_JSON_URL: 'data/drivemap.json'
    });
})();
