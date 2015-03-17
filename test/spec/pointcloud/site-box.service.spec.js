'use strict';

describe('site-box.service', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));
  beforeEach(module('mockedSites'));

  var SiteBoxService;
  beforeEach(function() {
    inject(function(_SiteBoxService_) {
      SiteBoxService = _SiteBoxService_;
    });
  });

  describe('initial state', function() {
    it('should have initial variables', function() {
      var initialMouse = {
        x: 0,
        y: 0
      };
      expect(SiteBoxService.mouse).toEqual(initialMouse);

      expect(SiteBoxService.siteBoxList).toEqual([]);
    });
  });

// Wat valt er te testen aan init?
//  describe('initialization', function() {
//    it('');
//  });

  describe('with SitesService loaded', function() {
    var SitesService = null;
    var CameraService = null;
    var THREE = null;
    var site162 = null;
    var siteBox162 = null;

    beforeEach(function() {
      inject(function(_SitesService_, _THREE_, _CameraService_, defaultSitesJSON) {
        SitesService = _SitesService_;
        SitesService.onLoad(defaultSitesJSON);
        THREE = _THREE_;
        CameraService = _CameraService_;
        site162 = defaultSitesJSON[0];
        siteBox162 = SiteBoxService.createSiteBox(site162);
      });
    });

    it('should create a sitebox (createSiteBox function)', function() {
      var center = SitesService.centerOfSite(site162);
      var position = new THREE.Vector3(center[0], center[1], center[2]);
      var size = SitesService.getBoundingBoxSize(site162);

      // position
      expect(siteBox162.position).toEqual(position);
      // size
      expect(siteBox162.geometry.parameters.width).toEqual(size[0]);
      expect(siteBox162.geometry.parameters.height).toEqual(size[1]);
      expect(siteBox162.geometry.parameters.depth).toEqual(size[2]);
      // site
      expect(siteBox162.site).toEqual(site162);
    });

    it('onSitesChanged function', function() {
      SiteBoxService.onSitesChanged([site162]);

      expect(SiteBoxService.siteBoxList[0].site.id).toEqual(siteBox162.site.id);
    });

    it('hoverOver function', function() {
      var color = new THREE.Color( 0x99FFFF );

      SiteBoxService.hoverOver(siteBox162);

      expect(siteBox162.material.color).toEqual(color);
    });

    it('hoverOut function', function() {
      var color = new THREE.Color( 0xFF99CC );

      SiteBoxService.hoverOut(siteBox162);

      expect(siteBox162.material.color).toEqual(color);
    });

    it('toggleTextLabel function', function() {
      SiteBoxService.addTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(true);

      SiteBoxService.toggleTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(false);

      SiteBoxService.toggleTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(true);
    });

    it('should select site 162 (siteBoxSelection function)', function() {
      var mouse = {x: -0.03288409703504047, y: 0.4328358208955224};
      var cameraPosition = new THREE.Vector3(745.9560389992655, 130.67543380673797, -1464.348219166323);

      CameraService.camera.position.copy(cameraPosition);

      var selected = SiteBoxService.siteBoxSelection(mouse.x, mouse.y);

      expect(selected.site).toEqual(site162);

    });

/*
    it('should select null (siteBoxSelection function)', function() {
      // TODO: fix this test, selected is not null, though it should be
      var mouse = {x: 0.3466307277628031, y: 0.8971807628524047};
      var cameraPosition = new THREE.Vector3(745.9560389992655, 130.67543380673797, -1464.348219166323);

      CameraService.camera.position.copy(cameraPosition);

      var selected = SiteBoxService.siteBoxSelection(mouse.x, mouse.y);

      expect(selected).toEqual(null);

    });
*/
  });

  describe('eventListener for double click', function() {

    var canvas;

    beforeEach(function() {
      canvas = jasmine.createSpyObj('canvas', ['addEventListener']);
    });

    it('should call addEventListener', function () {
      var f = SiteBoxService.selectSite;
      SiteBoxService.listenTo(canvas);
      expect(canvas.addEventListener).toHaveBeenCalledWith('dblclick', f, false);
    });

    it('should return when event is undefined', function () {
      expect(SiteBoxService.selectSite(undefined)).toEqual();
    });

    it('should select site on double click', function () {
      var mouse = {x: -0.03288409703504047, y: 0.4328358208955224};

      spyOn(SiteBoxService, 'siteBoxSelection');

      SiteBoxService.mouse = mouse;
      SiteBoxService.selectSite('event');

      expect(SiteBoxService.siteBoxSelection).toHaveBeenCalledWith(mouse.x, mouse.y);
    });
  });

});
