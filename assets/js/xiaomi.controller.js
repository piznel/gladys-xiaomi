(function() {
  'use strict';

  angular
    .module('gladys')
    .controller('xiaomiCtrl', xiaomiCtrl);

  xiaomiCtrl.$inject = ['xiaomiService', '$scope'];

  function xiaomiCtrl(xiaomiService, $scope) {
    /* jshint validthis: true */
    var vm = this
    vm.gateways = [];
    vm.gatewaysReady = false;
    vm.gatewaysCount = 0;
    vm.uncreated = [];
    vm.uncreatedReady = false;
    vm.uncreatedCount = 0;
    vm.unknown = []
    vm.unknownReady = false;
    vm.unknowCount = 0;
    vm.unknownDevice = null;
    vm.logUnknownDevice = '';
    vm.logUnknown = '';    

    vm.refresh = refresh;
    vm.savePassword = savePassword;
    vm.logUnknownStart = logUnknownStart;
    vm.logUnknownStop = logUnknownStop;

    activate()
    waitForUnknownLog()

    function refresh() {
      activate()
    }

    function savePassword() {
      return xiaomiService.savePassword(vm.gateways)
        .then(function(result) {
          if (result.status == 200) {
            xiaomiService.successNotificationTranslated('PASSWORD_UPDATED');
          } else { xiaomiService.errorNotificationTranslated('ERROR') }
        })
    }


    function activate() {
      xiaomiService.gateways()
        .then(function(result) {
          if (result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
          vm.gateways = result.data
          vm.gatewaysCount = vm.gateways.length
          if (vm.gatewaysCount === 0) {
            xiaomiService.errorNotificationTranslated('NO_GATEWAY')
            vm.gatewaysReady = false
          } else {
            vm.gateways.forEach(function(gateway) {
              if(!gateway.validKey) {
               xiaomiService.errorNotificationTranslated('INVALID_KEY')
              }              
            });
            vm.gatewaysReady = true
          }
        })

      xiaomiService.uncreated()
        .then(function(result) {
          if (result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
          vm.uncreated = result.data
          vm.uncreatedCount = vm.uncreated.length;
          if (vm.uncreatedCount === 0) {
            xiaomiService.successNotificationTranslated('NO_UNCREATED')
          } else {
            xiaomiService.errorNotificationTranslated('UNCREATED_FOUND')
          }
          vm.uncreatedReady = true
        })

      xiaomiService.unknown()
        .then(function(result) {
          if (result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
          vm.unknown = result.data
          vm.unknownCount = vm.unknown.length
          if (vm.unknownCount === 0) {
            xiaomiService.successNotificationTranslated('NO_UNKNOWN')
            vm.unknownReady = true
          } else {
            xiaomiService.errorNotificationTranslated('UNKNOWN_FOUND')
            vm.unknownReady = false
          }
          
        })
    }

    function logUnknownStart() {
      vm.logUnknown = '';
      xiaomiService.logUnknown(vm.unknownDevice)
    }

    function logUnknownStop() {
      xiaomiService.logUnknown()
    }

    function waitForUnknownLog() {
      io.socket.on('xiaomi_module_log', function(message) {
        vm.logUnknown = vm.logUnknown + JSON.stringify(message, null, 4) + '\n'
        $scope.$apply();
      });
    }
  }
})();
