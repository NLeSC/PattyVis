'use strict';

describe('core.sitesservice', function() {
  var sitesservice;
  var sitesjson;

  // load the module
  beforeEach(module('pattyApp.core', 'mockedSites'));

  beforeEach(function() {
    inject(function(defaultSitesJSON) {
      sitesjson = defaultSitesJSON;
    });
  });

  describe('load() function', function() {
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
      expect(sitesservice.filtered).toEqual(sitesjson);
    });
  });

  describe('find() function', function() {
    var site162json;

    beforeEach(function() {
      inject(function($injector) {
        site162json = [sitesjson[0]];
        sitesservice = $injector.get('sitesservice');
        sitesservice.onLoad(sitesjson);
      });
    });

    it('should have empty search result when query is empty', function() {
      sitesservice.find('');

      var result = sitesservice.searched;
      expect(result).toEqual([]);
    });

    it('should have full filtered result when query is empty', function() {
      sitesservice.find('');

      var result = sitesservice.filtered;
      expect(result).toEqual(sitesjson);
    });

    it('should have site1 as search result when query is 162', function() {
      sitesservice.find('162');

      var result = sitesservice.searched;
      expect(result).toEqual(site162json);
    });

    it('should have site1 as filtered result when query is 162', function() {
      sitesservice.find('162');

      var result = sitesservice.filtered;
      expect(result).toEqual(site162json);
    });

    it('should return site1 when query is pyramid', function() {
      sitesservice.find('pyramid');

      var result = sitesservice.searched;
      expect(result).toEqual(site162json);
    });
  });
});
