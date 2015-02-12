'use strict';

describe('core.sitesservice', function() {

  // load the module
  beforeEach(module('pattyApp.core'));

  var sitesservice;
  var sitesjson = [{
    'id': 162,
    'footprint': [
      [
        [
          [296254.482930933, 4633726.19264522],
          [296247.357277832, 4633735.03170707],
          [296247.748197456, 4633735.52663699],
          [296247.246448121, 4633736.09846306],
          [296256.481107703, 4633743.1682759],
          [296256.855867252, 4633742.67161996],
          [296257.337490172, 4633743.03926026],
          [296264.383732139, 4633734.06625588],
          [296264.026023897, 4633733.73391436],
          [296264.387774608, 4633733.1304567],
          [296255.366067528, 4633726.20345278],
          [296254.982315092, 4633726.58571713],
          [296254.482930933, 4633726.19264522]
        ]
      ]
    ],
    'thumbnail': 'http://148.251.106.132:8090/sites/162/P1120067.JPG',
    'description_site': 'Pyramid',
    'site_context': 'Funerary',
    'site_interpretation': 'Funerary tower',
    'pointcloud_bbox': [296247.246448120509740, 4633726.192645221017301, 121.484, 296264.387774608097970, 4633743.168275895528495, 144.177],
    'pointcloud': 'http://148.251.106.132:8090/POTREE/PC/SITE/162/SITE_162/SITE_162_8_levels_32cm_spacing/cloud.js',
    'reconstructionMesh': [],
    'objects': []
  }, {
    'id': 13,
    'footprint': [
      [
        [
          [296256.069935701, 4633691.8094286],
          [296254.971269128, 4633693.19429208],
          [296255.380766414, 4633693.51825223],
          [296256.456351441, 4633692.12764678],
          [296256.069935701, 4633691.8094286]
        ]
      ]
    ],
    'thumbnail': 'http://148.251.106.132:8090/sites/13/IMG_0040.JPG',
    'description_site': 'Block',
    'site_context': 'Unknown',
    'site_interpretation': 'Unknown',
    'pointcloud_bbox': [296254.971269128320273, 4633691.809428597800434, 120, 296256.456351440516300, 4633693.518252233974636, 120.42],
    'pointcloud': 'http://148.251.106.132:8090/POTREE/PC/SITE/S13/SITE_13_MAX_8BC/SITE_13_MAX_8BC_level4/cloud.js',
    'reconstructionMesh': [],
    'objects': []
  }];

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
    var site1json = [sitesjson[0]];

    beforeEach(function() {
      inject(function($injector) {
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
      expect(result).toEqual(site1json);
    });

    it('should have site1 as filtered result when query is 162', function() {
      sitesservice.find('162');

      var result = sitesservice.filtered;
      expect(result).toEqual(site1json);
    });

    it('should return site1 when query is pyramid', function() {
      sitesservice.find('pyramid');

      var result = sitesservice.searched;
      expect(result).toEqual(site1json);
    });
  });
});
