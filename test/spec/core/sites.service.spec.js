'use strict';

describe('core.SitesService', function() {
  var SitesService;
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
        SitesService = $injector.get('SitesService');
      });
    });

    it('should fetch json file', function() {
      SitesService.load();

      $httpBackend.expectGET('data/sites.json');
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(SitesService.all).toEqual(sitesjson);
      expect(SitesService.filtered).toEqual(sitesjson);
    });

    it('should resolve the ready promise', function() {
      var readyListener = jasmine.createSpy('listener');
      SitesService.ready.then(readyListener);

      SitesService.load();
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
        SitesService = $injector.get('SitesService');
        SitesService.onLoad(sitesjson);
      });
    });

    describe('find() function', function() {

      it('should have empty search result when query is empty', function() {
        SitesService.find('');

        var result = SitesService.searched;
        expect(result).toEqual([]);
      });

      it('should have full filtered result when query is empty', function() {
        SitesService.find('');

        var result = SitesService.filtered;
        expect(result).toEqual(sitesjson);
      });

      it('should have site1 as search result when query is `site:162`', function() {
        SitesService.find('site:162');

        var result = SitesService.searched;
        expect(result).toEqual([site162json]);
      });

      it('should have site1 as filtered result when query is `site:162`', function() {
        SitesService.find('site:162');

        var result = SitesService.filtered;
        expect(result).toEqual([site162json]);
      });

      it('should return site1 when query is pyramid', function() {
        SitesService.find('pyramid');

        var result = SitesService.searched;
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

        var result = SitesService.centerOfSite(site);

        var expected = [296255.817105, 4633734.680455, 132.8305];
        expect(result).toEqual(expected);
      });
    });

    describe('getById() function', function() {
      it('should return a site when id is present', function() {
        var result = SitesService.getById(162);

        expect(result).toEqual(site162json);
      });

      it('should return undefined when site with id is missing', function() {
        var result = SitesService.getById(9999999);

        expect(result).toBeUndefined();
      });
    });

    describe('selectSite() function', function() {
      it('should find only site 162', function() {
        SitesService.selectSite(site162json);

        var result = SitesService.searched;
        expect(result).toEqual([site162json]);
      });
    });
  });
});
