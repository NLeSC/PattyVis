(function() {
  'use strict';

  function sitesservice($http) {
    var sitesUrl = 'data/sites.json';

    function onLoad(data) {
      me.all = data;
    }

    var me = {
      all: {},
      filtered: {},
      searched: {},
      find: function(query) {
        if (query) {
          this.searched = angular.copy(this.all);

          var re = new RegExp(query, 'i');

          this.searched.features = this.all.features.filter(function(site) {
            return (re.test(site.properties.description) ||
              re.test(site.properties.interpretation) ||
              site.id === query * 1);
          }, this);
        } else {
          this.searched = {};
        }
      },
      load: function() {
        $http.get(sitesUrl).success(onLoad);
      },
      onLoad: onLoad
    };
    return me;
  }

  angular.module('pattyApp.core')
    .factory('sitesservice', sitesservice);
})();
