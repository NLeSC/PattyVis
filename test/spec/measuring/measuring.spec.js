'use strict';

fdescribe('measuring', function() {

  // load the module
  beforeEach(module('pattyApp.measuring'));

  fit('should create an application controller', inject(function($rootScope, $controller, SceneService, CameraService, MeasuringService) {
      var scope = $rootScope.$new();
      var ctrl = $controller('MeasuringController', { $scope: scope, SceneService:SceneService, CameraService:CameraService, MeasuringService:MeasuringService });
      expect(ctrl).toBeDefined();
  }));

  fdescribe('when the controller is loaded', function() {
    var scope;
    var ctrl;
    beforeEach(function() {
      inject(function($rootScope, $controller, SceneService, CameraService, MeasuringService) {
        scope = $rootScope.$new();
        ctrl = $controller('MeasuringController', { $scope: scope, SceneService: SceneService, CameraService: CameraService });
      });
    });

    fdescribe('initial state', function() {
      fit('should set default variables', function() {
        expect(ctrl.showToolboxTray).toBeFalsy();
        expect(ctrl.measuringService).toBeDefined();

        var tools = {
          distance: null,
          angle: null,
          area: null,
          volume: null,
          heightprofile: null,
          clipvolume: null
        };
        expect(ctrl.measuringService.tools).toEqual(tools);

        expect(ctrl.measuringService.pointcloud).toEqual(null);
        expect(ctrl.measuringService.sitePointcloud).toEqual(null);
        expect(ctrl.measuringService.profileWidth).toEqual(0.1);
        expect(ctrl.measuringService.initialized).toBeFalsy();
      });
    });
  });



});
