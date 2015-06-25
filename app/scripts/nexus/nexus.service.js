/**
 * @namespace nexus
 */
(function() {
  'use strict';

  function NexusService(Presenter, SphereTrackball) {
    var service = {};
    service.siteShown = false;
    service.setTarget = function(element) {
      this.presenter = new Presenter(element);
    };
    service.showSite = function(site) {
      this.siteShown = true;

      var url = 'data/sites/SITE_35.nxs';
      if (site.id % 2 === 0) {
        url = 'data/SHOU_LAO.nxs';
      }

      this.presenter.setScene({
        meshes: {
          'site': {
            // url: site.mesh[0].nexus
            url: url
          }
        },
        modelInstances: {
          'site': {
            mesh: 'site'
          }
        },
        trackball: {
    			type: SphereTrackball
    		}
      });
    };

    service.close = function() {
      this.presenter.setScene({});
      this.siteShown = false;
    };

    service.zoomIn = function() {
      this.presenter.zoomIn();
    };

    service.zoomOut = function() {
      this.presenter.zoomOut();
    };

    service.reset = function() {
      this.presenter.resetTrackball();
    };

    Object.defineProperty(service, 'trackLight', {
      get: function() {
        return service.presenter.isLightTrackballEnabled();
      },
      set: function(enabled) {
        service.presenter.enableLightTrackball(enabled);
      },
      enumerable: true,
      configurable: true
    });

    var color = true;
    Object.defineProperty(service, 'color', {
      get: function() {
        return color;
      },
      set: function(enabled) {
        service.presenter.setInstanceSolidColorByName('site', enabled);
        color = enabled;
      },
      enumerable: true,
      configurable: true
    });

    return service;
  }

  angular.module('pattyApp.nexus')
    .factory('NexusService', NexusService);
})();
