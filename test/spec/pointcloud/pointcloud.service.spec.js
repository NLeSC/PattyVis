'use strict';

describe('pointcloud.service', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));
  beforeEach(module('mockedSites', 'mockedDrivemap'));

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

  describe('with SitesService, DrivemapService and PathControls loaded', function() {
    var SitesService = null,
      DrivemapService = null,
      canvasElement = null,
      site162 = null;

    beforeEach(inject(function(_SitesService_, defaultSitesJSON) {
      SitesService = _SitesService_;
      SitesService.onLoad(defaultSitesJSON);
      site162 = defaultSitesJSON[0];
    }));

    beforeEach(inject(function(_DrivemapService_, defaultDrivemapJSON) {
      DrivemapService = _DrivemapService_;
      DrivemapService.onLoad(defaultDrivemapJSON);
    }));

    beforeEach(inject(function(PathControls, CameraService, defaultCameraPathThree, defaultLookPathThree) {
      canvasElement = jasmine.createSpyObj('element', ['addEventListener']);
      PathControls.init(CameraService.camera, defaultCameraPathThree, defaultLookPathThree, canvasElement);
      PointcloudService.elRenderArea = canvasElement;
    }));

    describe('enterOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.enterOrbitMode(null, site162);
      });

      it('should select the site', function() {
        expect(SitesService.searched).toEqual([site162]);
      });

      it('should set isInOrbitMode to true', function() {
        expect(PointcloudService.isInOrbitMode).toBeTruthy();
      });
    });

    describe('exitOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.exitOrbitMode();
      });

      it('should select no sites', function() {
        expect(SitesService.searched).toEqual([]);
      });

      it('should set isInOrbitMode to false', function() {
        expect(PointcloudService.isInOrbitMode).toBeFalsy();
      });
    });
  });
});
