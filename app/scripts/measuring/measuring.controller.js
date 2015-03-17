(function() {
  'use strict';

  function MeasuringController(MeasuringService) {
    this.showToolboxTray = false;
    this.showTransformationToolboxTray = false;

    this.distanceActive = false;
    this.angleActive = false;
    this.areaActive = false;
    this.volumeActive = false;
    this.heightProfileActive = false;
    this.clipVolumeActive = false;

    this.transformationRotateActive = false;
    this.transformationTranslateActive = false;
    this.transformationScaleActive = false;

    this.measuringService = MeasuringService;

    this.toggleToolbox = function() {
      this.resetState();

      this.showToolboxTray = !this.showToolboxTray;

      this.measuringService.clear();
    };

    this.resetState = function() {
      this.distanceActive = false;
      this.angleActive = false;
      this.areaActive = false;
      this.volumeActive = false;
      this.heightProfileActive = false;
      this.clipVolumeActive = false;

      this.transformationRotateActive = false;
      this.transformationTranslateActive = false;
      this.transformationScaleActive = false;

      this.showTransformationToolboxTray = false;
    };

    this.startDistance = function() {
      this.resetState();
      this.distanceActive = true;
      this.measuringService.startDistance();
    };

    this.startAngle = function() {
      this.resetState();
      this.angleActive = true;
      this.measuringService.startAngle();
    };

    this.startArea = function() {
      this.resetState();
      this.areaActive = true;
      this.measuringService.startArea();
    };

    this.startAngle = function() {
      this.resetState();
      this.angleActive = true;
      this.measuringService.startAngle();
    };

    this.startVolume = function() {
      this.resetState();
      this.volumeActive = true;
      this.measuringService.startVolume();

      this.showTransformationToolboxTray = true;
    };

    this.startHeightProfile = function() {
      this.resetState();
      this.heightProfileActive = true;
      this.measuringService.startHeightProfile();
    };

    this.startClipVolume = function() {
      this.resetState();
      this.clipVolumeActive = true;
      this.measuringService.startClipVolume();

      this.showTransformationToolboxTray = true;
    };

    this.toggleRotate = function() {
      this.resetState();
      this.transformationRotateActive = true;
      this.measuringService.tools.transformation.rotate();

      this.showTransformationToolboxTray = true;
    };

    this.toggleTranslate = function() {
      this.resetState();
      this.transformationTranslateActive = true;
      this.measuringService.tools.transformation.translate();

      this.showTransformationToolboxTray = true;
    };

    this.toggleScale = function() {
      this.resetState();
      this.transformationScaleActive = true;
      this.measuringService.tools.transformation.scale();

      this.showTransformationToolboxTray = true;
    };
  }

  angular.module('pattyApp.measuring').controller('MeasuringController', MeasuringController);
})();
