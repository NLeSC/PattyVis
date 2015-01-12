'use strict';

describe('core.sites', function() {

  // load the module
  beforeEach(module('pattyApp.core'));

  var sitesservice;
  var sitesjson = {
    'features': [{
      'id': 1,
      'properties': {
        'description': 'Pyramid',
        'site_interpretation': 'Funerary tower'
      }
    }, {
      'id': 2,
      'properties': {
        'description': 'Block',
        'site_interpretation': 'Unknown',
      }
    }]
  };

  describe('load', function() {
    var $httpBackend;

    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'data/sites.json').respond(sitesjson);
        sitesservice = $injector.get('sitesservice');
      });
    });
    it('should fetch json file', function() {
      sitesservice.load();

      $httpBackend.expectGET('data/sites.json');
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(sitesservice.all).toEqual(sitesjson);
    });
  });

  describe('find', function() {
    var site1json = {
      'features': [{
        'id': 1,
        'properties': {
          'description': 'Pyramid',
          'site_interpretation': 'Funerary tower'
        }
      }]
    };

    beforeEach(function() {
      inject(function($injector) {
        sitesservice = $injector.get('sitesservice');
        sitesservice.onLoad(sitesjson);
      });
    });

    it('should return nothing when query is empty', function() {
      sitesservice.find('');

      var result = sitesservice.searched;
      expect(result).toEqual({});
    });

    it('should return site1 when query is 1', function() {
      sitesservice.find('1');

      var result = sitesservice.searched;
      expect(result).toEqual(site1json);
    });

    it('should return site1 when query is pyramid', function() {
      sitesservice.find('pyramid');

      var result = sitesservice.searched;
      expect(result).toEqual(site1json);
    });
  });
});
