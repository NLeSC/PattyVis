'use strict';

describe('measuring', function() {

  // load the module
  beforeEach(module('pattyApp.measuring'));

  describe('directive', function() {
    it('should create an application controller', inject(function($rootScope, $controller, MeasuringService) {
      var scope = $rootScope.$new();
      var ctrl = $controller('MeasuringController', {
        $scope: scope,
        MeasuringService: MeasuringService
      });
      expect(ctrl).toBeDefined();
      expect(MeasuringService).toBeDefined();
    }));
  });

  describe('controller', function() {
    var scope;
    var ctrl;
    var measuringService;
    beforeEach(function() {
      inject(function($rootScope, $controller, MeasuringService) {
        scope = $rootScope.$new();
        ctrl = $controller('MeasuringController', {
          $scope: scope,
          MeasuringService: MeasuringService
        });

        measuringService = MeasuringService;
      });
    });

    describe('initial state', function() {
      it('should set default variables', function() {
        expect(ctrl.showToolboxTray).toBeFalsy();
        expect(ctrl.showTransformationToolboxTray).toBeFalsy();
        expect(ctrl.measuringService).toBeDefined();

        expect(ctrl.distanceActive).toBeFalsy();
        expect(ctrl.angleActive).toBeFalsy();
        expect(ctrl.areaActive).toBeFalsy();
        expect(ctrl.volumeActive).toBeFalsy();
        expect(ctrl.heightProfileActive).toBeFalsy();
        expect(ctrl.clipVolumeActive).toBeFalsy();
      });
    });

    describe('ui functions', function() {
      describe('resetState', function() {
        it('should reset the state to the initial state', function() {
          ctrl.distanceActive = true;
          ctrl.angleActive = true;
          ctrl.areaActive = true;
          ctrl.volumeActive = true;
          ctrl.heightProfileActive = true;
          ctrl.clipVolumeActive = true;

          ctrl.showTransformationToolboxTray = true;

          ctrl.resetState();

          expect(ctrl.distanceActive).toBeFalsy();
          expect(ctrl.angleActive).toBeFalsy();
          expect(ctrl.areaActive).toBeFalsy();
          expect(ctrl.volumeActive).toBeFalsy();
          expect(ctrl.heightProfileActive).toBeFalsy();
          expect(ctrl.clipVolumeActive).toBeFalsy();

          expect(ctrl.showTransformationToolboxTray).toBeFalsy();
        });
      });

      describe('toggleToolbox', function() {
        it('should toggle the toolbox on/off', function() {
          ctrl.showToolboxTray = true;
          ctrl.toggleToolbox();
          expect(ctrl.showToolboxTray).toBeFalsy();

          ctrl.showToolboxTray = false;
          ctrl.toggleToolbox();
          expect(ctrl.showToolboxTray).toBeTruthy();
        });

        it('should remove all measurements upon closing the toolbox', function() {
          spyOn(measuringService, 'clear');
          ctrl.toggleToolbox();

          expect(measuringService.clear).toHaveBeenCalled();

        });

        it('should reset the state to the initial state', function() {
          spyOn(ctrl, 'resetState');

        });
      });
    });
  });

  describe('service', function() {
    var scope;
    var ctrl;
    var service;
    beforeEach(function() {
      inject(function($rootScope, $controller, MeasuringService) {
        scope = $rootScope.$new();
        ctrl = $controller('MeasuringController', {
          $scope: scope,
          MeasuringService: MeasuringService
        });
        service = ctrl.measuringService;
      });
    });

    it('should set default variables', function() {
      var tools = {
        distance: null,
        angle: null,
        area: null,
        volume: null,
        heightprofile: null,
        clipvolume: null,
        transformation: null
      };
      expect(service.tools).toEqual(tools);

      expect(service.pointcloud).toEqual(null);
      expect(service.sitePointcloud).toEqual(null);
      expect(service.profileWidth).toEqual(0.1);
      expect(service.initialized).toBeFalsy();

      expect(service.activeTransformationTool).toBe(service.transformationTools.ROTATE);
    });
  });
});
