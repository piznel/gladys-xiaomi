   
 (function () {
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
        vm.uncreated = [];
        vm.uncreatedReady = false;
        vm.unknown = []
        vm.unknownReady = false;
        
        activate()

        function activate() {
            xiaomiService.gateways()
                .then(function(result){
                    if(result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
                    vm.gateways = result.data
                    if(vm.gateways.length == 0) {
                        xiaomiService.errorNotificationTranslated('NO_GATEWAY')
                        vm.gatewaysReady = false
                    }else {
                        vm.gatewaysReady = true
                    }
                })

            xiaomiService.uncreated()
                .then(function(result){
                    if(result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
                    vm.uncreated = result.data
                    if(vm.uncreated.length == 0) {
                        xiaomiService.errorNotificationTranslated('NO_GATEWAY')
                        vm.uncreatedReady = false
                    }else {
                        vm.uncreatedReady = true
                    }
                })

            xiaomiService.unknown()
                .then(function(result){
                    if(result.status != 200) xiaomiService.errorNotificationTranslated('ERROR')
                    vm.unknown = result.data
                    if(vm.unknown.length == 0) {
                        xiaomiService.errorNotificationTranslated('NO_GATEWAY')
                        vm.unknownReady = false
                    }else {
                        vm.unknownReady = true
                    }
                })
        }


    }
})();