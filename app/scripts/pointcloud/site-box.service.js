(function() {
    'use strict';

    function SiteBoxService($rootScope, THREE, sitesservice, CameraService) {
        var me = this;

        this.siteBoxList = [];
        this.selectedSiteBox = null;
        this.isSiteBoxSelected = false;

        this.onSitesChanged = function(sites) {
            if(sitesservice.isLoaded){
                me.siteBoxList = [];
                for(i=0; i<sites.features.length; i++){
                    me.siteBoxList.push(me.createSiteBox(sites.features[i]));
                }
            }
        };

        $rootScope.$watch(function() {
            return sitesservice.all;
        }, this.onSitesChanged);

        this.hoverOver = function(siteBox) {
            siteBox.material.color.setHex(0x99FFFF);
        };

        this.hoverOut = function(siteBox) {
            siteBox.material.color.setHex(0xFF99CC);
        };

        this.listenTo = function(element) {
            element.addEventListener('dblclick', this.selectSite, false);
        };

        this.selectSite = function(event) {
            if (me.isSiteBoxSelected) {
                console.log("selected SiteBox: " + me.selectedSiteBox.name);
            }
        };

        this.createSiteBox = function(site){
            var siteCenter = sitesservice.centerOfSite(site);
            var boxSize = sitesservice.getBoundingBoxSize(site);

            var boxGeometry = new THREE.BoxGeometry(boxSize[0], boxSize[1], boxSize[2]);
            var boxMaterial = new THREE.MeshBasicMaterial({
                color : 0xFF99CC,
                // transparent: false,
                wireframe : true,
                // opacity: 1,
                // overdraw: 0.5
            });
            var bBox = new THREE.Mesh(boxGeometry, boxMaterial);
            bBox.position.set(siteCenter[0], siteCenter[1], siteCenter[2]);
            bBox.name = site.id;

            return bBox;
        }

        this.siteBoxSelection = function(mouseX, mouseY, raycaster) {
            var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
            vector.unproject(CameraService.camera);
            raycaster.ray.set(CameraService.camera.position, vector.sub(CameraService.camera.position).normalize());
     
            // hovering over SiteBoxes
            var intersects = raycaster.intersectObjects(me.siteBoxList, false);

            // reset hovering
            me.siteBoxList.forEach(function (siteBox) {
                me.hoverOut(siteBox);
            });

            if (intersects.length > 0) {
                me.selectedSiteBox = intersects[0].object;
                me.isSiteBoxSelected = true;
                me.hoverOver(me.selectedSiteBox);
            } else {
                me.isSiteBoxSelected = false;
            }
        }

    }

    angular.module('pattyApp.pointcloud')
    .service('SiteBoxService', ['$rootScope', 'THREE', 'sitesservice', 'CameraService', SiteBoxService]);
})();
