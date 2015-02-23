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

    it('should resolve the ready promise', function() {
      var readyListener = jasmine.createSpy('listener');
      sitesservice.ready.then(readyListener);

      sitesservice.load();
      // resolve http request
      $httpBackend.flush();

      expect(readyListener).toHaveBeenCalledWith(sitesjson);
    });
  });

  describe('when sites have been loaded', function() {
    var site162json;

    beforeEach(function() {
      inject(function($injector) {
        site162json = sitesjson[0];
        sitesservice = $injector.get('sitesservice');
        sitesservice.onLoad(sitesjson);
      });
    });

    describe('find() function', function() {

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
        expect(result).toEqual([site162json]);
      });

      it('should have site1 as filtered result when query is 162', function() {
        sitesservice.find('162');

        var result = sitesservice.filtered;
        expect(result).toEqual([site162json]);
      });

      it('should return site1 when query is pyramid', function() {
        sitesservice.find('pyramid');

        var result = sitesservice.searched;
        expect(result).toEqual([site162json]);
      });
    });

    describe('centerOfSite() function', function() {

      it('should return center of bounding box', function() {
        var minlon = 296247.24644;
        var minlat = 4633726.19264;
        var minalt = 121.484;
        var maxlon = 296264.38777;
        var maxlat = 4633743.16827;
        var maxalt = 144.177;
        var bbox = [minlon, minlat, minalt, maxlon, maxlat, maxalt];
        var site = {
          pointcloud_bbox: bbox // jshint ignore:line
        };

        var result = sitesservice.centerOfSite(site);

        var expected = [296255.817105, 4633734.680455, 132.8305];
        expect(result).toEqual(expected);
      });
    });

    describe('getById() function', function() {
      it('should return a site when id is present', function() {
        var result = sitesservice.getById(162);

        expect(result).toEqual(site162json);
      });

      it('should return undefined when site with id is missing', function() {
        var result = sitesservice.getById(9999999);

        expect(result).toBeUndefined();
      });
    });
  });
});
