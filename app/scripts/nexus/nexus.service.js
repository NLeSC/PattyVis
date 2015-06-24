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
    return service;
  }

  angular.module('pattyApp.nexus')
    .factory('NexusService', NexusService);
})();
