'use strict';

describe('pointcloud-controls.directive', function() {

  // load the module
  beforeEach(module('pattyApp'));

  var $compile;
  var $rootScope;
  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });
  
  it('should have a settings icon', function() {
    var scope = $rootScope.$new();
    var html = '<patty-pointcloud-controls></patty-pointcloud-controls>';
    var result = $compile(html)(scope);
    expect(result.html()).toContain('glyphicon-cog');
  });
});
