(function() {
  'use strict';

  const keyCodes = {
    'left': 65,
    'right': 68,
    'up': 87,
    'down': 83
  };

  const keyNames = {
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'up': 'ArrowUp',
    'down': 'ArrowDown'
  };

  function KeyboardController($rootScope, PathControls, PointcloudService, CameraService) {
    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;

    const addKeyController = (keys, direction) => {
      document.addEventListener('keydown', e => {
        if (keys.indexOf(e.key) !== -1) {
          this[direction] = true;
          $rootScope.$applyAsync();
        }
      });
      document.addEventListener('keyup', e => {
        if (keys.indexOf(e.key) !== -1) {
          this[direction] = false;
          $rootScope.$applyAsync();
        }
      });
    };

    addKeyController(['ArrowLeft', 'a'], 'left');
    addKeyController(['ArrowUp', 'w'], 'up');
    addKeyController(['ArrowRight', 'd'], 'right');
    addKeyController(['ArrowDown', 's'], 'down');


    this.onMouse = (key, down=true) => {
      const eventType = down ? 'keydown' : 'keyup';
      document.dispatchEvent(new KeyboardEvent(eventType, {keyCode: keyCodes[key], key: keyNames[key]}));
    };
  }

  angular.module('pattyApp.keyboard').controller('KeyboardController', KeyboardController);
})();
