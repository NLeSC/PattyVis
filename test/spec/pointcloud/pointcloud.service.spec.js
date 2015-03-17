'use strict';

describe('pointcloud.service', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));
  beforeEach(module('mockedSites'));

  var PointcloudService;
  var Potree;
  beforeEach(function() {
    inject(function(_PointcloudService_, _Potree_) {
      PointcloudService = _PointcloudService_;
      Potree = _Potree_;
    });
  });


  describe('initial state', function() {
    it('should have settings', function() {

      var expected = {
        pointCountTarget: 1.0,
        pointSize: 0.2,
        opacity: 1,
        showSkybox: true,
        interpolate: false,
        showStats: false,
        pointSizeType: Potree.PointSizeType.ATTENUATED,
        pointSizeTypes: Potree.PointSizeType,
        pointColorType: Potree.PointColorType.RGB,
        pointColorTypes: Potree.PointColorType,
        pointShapes: Potree.PointShape,
        pointShape: Potree.PointShape.CIRCLE,
        clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
        clipModes: Potree.ClipMode
      };

      expect(PointcloudService.settings).toEqual(expected);
    });
  });

  describe('with SitesService loaded', function() {
    var SitesService = null,
      site162 = null;

    beforeEach(function() {
      inject(function(_SitesService_, defaultSitesJSON) {
        SitesService = _SitesService_;
        SitesService.onLoad(defaultSitesJSON);
        site162 = defaultSitesJSON[0];
      });
    });

    describe('enterOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.enterOrbitMode(site162);
      });

      it('should select the site', function() {
        expect(SitesService.searched).toEqual([site162]);
      });
    });

    describe('exitOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.exitOrbitMode();
      });

      it('should select no sites', function() {
        expect(SitesService.searched).toEqual([]);
      });
    });
  });

});
