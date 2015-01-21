(function() {
    'use strict';

    function SiteBoxService($rootScope, THREE, sitesservice) {
        var me = this;

        this.siteBoxList = [];

        this.onSitesChanged = function(sites) {
            //var features = sitesservice.getAllFeatures();
            console.log('onSitesChanged');
            if(sitesservice.isLoaded){
                me.siteBoxList = [];
                for(i=0; i<sites.features.length; i++){
                    me.siteBoxList.push(me.createSiteBox(sites.features[i]));
                }
                console.log(me.siteBoxList);
            }
        };

        $rootScope.$watch(function() {
            // console.log('watch');
            // console.log(sitesservice);
            return sitesservice.all;
        }, this.onSitesChanged);

        this.createSiteBox = function(site){
            var siteCenter = sitesservice.centerOfSite(site);
            var boxSize = sitesservice.getBoundingBoxSize(site);

            var boxGeometry = new THREE.BoxGeometry(boxSize[0], boxSize[1], boxSize[2]);
            // 296254.971269128320273,4633691.809428597800434, 120,296256.456351440516300,4633693.518252233974636, 120.42
            // [296247.246448120509740,4633726.192645221017301, 121.484,296264.387774608097970,4633743.168275895528495, 144.177]
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



        // hover
        // onclick


    }

    angular.module('pattyApp.pointcloud')
    .service('SiteBoxService', ['$rootScope', 'THREE', 'sitesservice', SiteBoxService]);
})();
