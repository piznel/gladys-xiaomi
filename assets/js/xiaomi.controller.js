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

    vm.refresh = refresh;
    vm.savePassword = savePassword;

    activate()

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
            for(var gateway of vm.gateways) {
              if(!gateway.validKey) {
               xiaomiService.errorNotificationTranslated('INVALID_KEY')
              }
            };
            vm.gatewaysReady = true
          }
        })

      xiaomiService.uncreated()
        .then(function(result) {
          if (result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
          vm.uncreated = result.data
          vm.uncreatedCount = vm.uncreated.length;
          if (vm.uncreatedCount === 0) {
            xiaomiService.successNotificationTranslated('NO_UNKNOWN')
          }
          vm.uncreatedReady = true
        })

      xiaomiService.unknown()
        .then(function(result) {
          if (result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
          vm.unknown = result.data
          vm.unknownCount = vm.unknown.length
          if (vm.unknownCount === 0) {
            xiaomiService.successNotificationTranslated('NO_UNCREATED')
          }
          vm.unknownReady = true
        })
    }


  }
})();